import Cookies from 'js-cookie';

export class CookieService {

  setCookie(key: string, data: any) {
    try {
      Cookies.set(key, data, { expires: 365, path: '/' });
    } catch (error) {
      console.log('error', error);
    }
  }

  getCookie(key: string) {
    const data = Cookies.get(key);
    return data ? JSON.parse(data) : null;
  }

  deleteAllCookies() {
    return new Promise((resolve) => {
      const cookieNames = Object.keys(Cookies.get());
      cookieNames.forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
      resolve(true);
    });
  }
}
