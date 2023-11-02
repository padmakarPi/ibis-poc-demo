import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import AuthService from '@/services/auth.service';

const api: AxiosInstance = axios.create({});
const authService = new AuthService();

export const JWTExpireInterceptor = async (error: AxiosError): Promise<any> => {
  // Check if the error is due to an expired JWT token
  if (error.response?.status === 401 || error.response?.status === 403) {
    try {
      const originalRequest = error.config;
      const token = await authService.getToken();
      if (originalRequest) {
        originalRequest.headers.Authorization = `Bearer ${token.access_token}`;
        api(originalRequest);
      }
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

export const successResponse = (response: AxiosResponse) => response;
