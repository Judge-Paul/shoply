import axios, { AxiosError, AxiosRequestConfig } from "axios";

const baseURL = "https://fakestoreapi.com";

type Config = AxiosRequestConfig<object>;

const api = axios.create({
  baseURL,
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export const get = (route: string, config?: Config) => api.get(route, config);
export const post = (route: string, data?: object, config?: Config) =>
  api.post(route, data, config);
export const put = (route: string, data?: object) => api.put(route, data);
export const del = (route: string) => api.delete(route);

export default api;
