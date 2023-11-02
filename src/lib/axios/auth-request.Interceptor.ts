import { InternalAxiosRequestConfig } from 'axios';
import AuthService from '@/services/auth.service';

export const authRequestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const authService = new AuthService();

  const tokenData: any = JSON.parse(localStorage.getItem('token') || '{}');
  if (tokenData && tokenData.access_token && tokenData.expireAt > Date.now()) {
    if (tokenData.access_token) {
            config.headers!.authorization = `Bearer ${tokenData.access_token}`;
    }
        config.headers!.Accept = 'application/json';
        return config;
  } if (tokenData.refresh_token) {
    const _tokenData = await authService.getToken();
    if (_tokenData.access_token) {
            config.headers!.authorization = `Bearer ${_tokenData.access_token}`;
    }
        config.headers!.Accept = 'application/json';
        return config;
  }
  return config;
};
