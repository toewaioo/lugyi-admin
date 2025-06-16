// src/services/api.js
import axios from "axios";
import { store } from "../redux/store";
import { logout, refreshAccessToken } from "../features/auth/redux/authActions"; // Include refreshAccessToken if you implement it

const API_BASE_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach access_token to outgoing requests main

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken; // Now correctly getting accessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token expiration/refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const state = store.getState();
    const refreshToken = state.auth.refreshToken;

    // If 401 Unauthorized and not already retrying
    // IMPORTANT: Ensure your backend returns a clear status code like 401 for expired access tokens.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // You would implement your refresh token logic here.
      // Example:
      // if (refreshToken) {
      //   try {
      //     // Dispatch action to refresh token
      //     await store.dispatch(refreshAccessToken(refreshToken));
      //     // Update the original request with the new access token and retry
      //     const newAccessToken = store.getState().auth.accessToken;
      //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      //     return api(originalRequest); // Retry the original request
      //   } catch (refreshError) {
      //     // If refresh fails, log out
      //     store.dispatch(logout());
      //     // Redirect to login (handled by AuthGuard or component logic)
      //     return Promise.reject(refreshError);
      //   }
      // } else {
      //   // No refresh token available, just log out
      //   store.dispatch(logout());
      // }

      // For this guide, we'll simply log out if we get a 401 and no refresh logic is implemented or successful.
      store.dispatch(logout());
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
