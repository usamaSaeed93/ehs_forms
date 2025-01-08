// src/axiosConfig.ts
import axios, { InternalAxiosRequestConfig } from "axios";

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://app.dfwcz.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("auth");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
