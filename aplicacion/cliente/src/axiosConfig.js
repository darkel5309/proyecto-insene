import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:5174/api",
  withCredentials: true,
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default Axios;
