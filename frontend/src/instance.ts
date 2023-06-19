/* eslint-disable no-param-reassign */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ROUTES } from './constants.ts';

const baseURL = 'http://localhost:5000';

const instance = axios.create({
  baseURL
});

// @ts-ignore
instance.interceptors.request.use<AxiosRequestConfig>(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (config.headers == null) {
      config.headers = {};
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// @ts-ignore
instance.interceptors.response.use<AxiosResponse>(
  (config: AxiosResponse) => config,
  async (error) => {
    if (error?.response?.status === 401 && error.response.url.includes(baseURL)) {
      localStorage.removeItem('token');
      window.location.replace(`${window.location.origin}${ROUTES.LOGIN}`);
    }
    return Promise.reject(error);
  }
);

export default instance;
