import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import login from 'src/api/login';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 5000,
});

// Function to handle re-authentication
let isRefreshing = false;
let failedQueue: any[] = [];

// Helper to process failed requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we receive a 401 error, try to re-authenticate
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Prevent infinite loop by marking the request as retried
      originalRequest._retry = true;

      // If another request is already refreshing the token, queue this one
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Set refreshing state to true to avoid multiple refresh calls
      isRefreshing = true;

      try {
        const newToken = await login();
        processQueue(null, newToken); // Retry all queued requests with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // Retry the original request
      } catch (err) {
        processQueue(err, null); // Reject all queued requests if refresh failed
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
