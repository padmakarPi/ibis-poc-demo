import { User } from 'oidc-client';
import * as qs from 'qs';
import { setLocalStorage, getStorageValue } from '@/services/localstorage.service';
import { CookieService } from '@/services/cookie.service';
import { userManager } from '@/constants/config/oidc.config';
import { COMMON_METADATA } from '@/constants/metadata/common.metadata';
import { TokenData } from '@/interfaces/token-data.interface';

export default class AuthService {
  private cookieService = new CookieService();

  private userManager = userManager;

  public getUser(): Promise<User | null> {
    return this.userManager.getUser();
  }

  public login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  public renewToken(): Promise<User> {
    return this.userManager.signinSilent();
  }

  public storeUser(user: User): Promise<void> {
    return this.userManager.storeUser(user);
  }

  public async logout(): Promise<void> {
    await this.cookieService.deleteAllCookies();
    return this.userManager.signoutRedirect();
  }

  private getCurrentTimePlusSeconds(seconds: number): number {
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + seconds * 1000);
    return futureTime.getTime();
  }

  public loginAuthorization(email: string) {
    return new Promise<TokenData>((resolve, reject) => {
      const body = {
        client_id: btoa(process.env.NEXT_PUBLIC_MSTS_CLIENT_ID || '277AFC1D-AF71-4D58-BF11-A9F4FEFAD187'),
        client_secret: btoa(process.env.NEXT_PUBLIC_MSTS_CLIENT_SECRET || 'E66B022B-954B-4BCA-B108-E517D00BC4D4'),
        grant_type: process.env.NEXT_PUBLIC_MSTS_GRANT_TYPE || 'password',
        userName: btoa(email),
        password: btoa(process.env.NEXT_PUBLIC_MSTS_GRANT_PASSWORD || 'omniauth'),
      };
      const data = qs.stringify(body);
      fetch(process.env.NEXT_PUBLIC_OMNI_URL || 'https://dev-msts.v.group/omnijwttoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      }).then((response) => response.json())
        .then((respData) => {
          if (respData) {
            const tokenData: TokenData = {
              ...respData,
              expireAt: this.getCurrentTimePlusSeconds(respData.expires_in),
            };
            setLocalStorage(COMMON_METADATA.TOKEN_STORE_KEY, JSON.stringify(tokenData));
            resolve(tokenData);
          } else {
            console.error('Something went wrong');
            reject(new Error('Something went wrong'));
          }
        })
        .catch((error) => {
          console.error('Error while login', error);
          reject(error);
        });
    });
  }

  public refreshAuthorizationToken(refreshToken: string) {
    return new Promise<TokenData>((resolve, reject) => {
      const body = {
        client_id: btoa(process.env.NEXT_PUBLIC_MSTS_CLIENT_ID || '277AFC1D-AF71-4D58-BF11-A9F4FEFAD187'),
        client_secret: btoa(process.env.NEXT_PUBLIC_MSTS_CLIENT_SECRET || 'E66B022B-954B-4BCA-B108-E517D00BC4D4'),
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      };
      const data = qs.stringify(body);

      fetch(process.env.NEXT_PUBLIC_OMNI_URL || 'https://dev-msts.v.group/omnijwttoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData) {
            if (responseData?.error) {
              setLocalStorage(COMMON_METADATA.TOKEN_STORE_KEY, '');
              this.logout();
              return;
            }
            const tokenData: TokenData = {
              ...responseData,
              expireAt: this.getCurrentTimePlusSeconds(responseData.expires_in),
            };
            setLocalStorage(COMMON_METADATA.TOKEN_STORE_KEY, JSON.stringify(tokenData));
            resolve(tokenData);
          } else {
            setLocalStorage(COMMON_METADATA.TOKEN_STORE_KEY, '');
            this.logout();
            console.error('Something went wrong');
            reject(new Error('Something went wrong'));
          }
        })
        .catch((error) => {
          setLocalStorage(COMMON_METADATA.TOKEN_STORE_KEY, '');
          this.logout();
          console.error('Error while login', error);
          reject(error);
        });
    });
  }

  public getToken = async (): Promise<any> => {
    const authService = new AuthService();
    const tokenData = getStorageValue('token');
    if (!tokenData || !tokenData.access_token) {
      this.logout();
      setLocalStorage(COMMON_METADATA.TOKEN_STORE_KEY, '');
    } else if (tokenData && tokenData.access_token && tokenData.expireAt > Date.now()) {
      return tokenData;
    } else if (tokenData && tokenData.refresh_token) {
      await authService.refreshAuthorizationToken(tokenData.refresh_token);
      return this.getToken();
    }
    return null;
  };
}
