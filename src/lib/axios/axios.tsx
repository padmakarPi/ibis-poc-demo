import Axios, { AxiosInstance } from 'axios';
import { authRequestInterceptor } from './auth-request.Interceptor';
import { JWTExpireInterceptor, successResponse } from './jwt-expire.Interceptor';

export const createAxiosInstance = (baseURL: string | undefined): AxiosInstance => {
  const axiosInstance: AxiosInstance = Axios.create({
    baseURL,
  });

  axiosInstance.interceptors.request.use(authRequestInterceptor);
  axiosInstance.interceptors.response.use(successResponse, JWTExpireInterceptor);

  return axiosInstance;
};
