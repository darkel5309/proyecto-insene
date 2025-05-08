import axios from "axios";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5174/api",
  withCredentials: true,
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && window.location.pathname !== '/') {
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default Axios;
