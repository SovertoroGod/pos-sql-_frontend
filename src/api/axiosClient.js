import axios from "axios";
import { store } from "../app/store";
import { logout } from "../modules/auth/authSlice";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      store.dispatch(logout());
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;