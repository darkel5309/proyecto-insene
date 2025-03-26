import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:5174/api",
  withCredentials: true,
});

export default Axios;
