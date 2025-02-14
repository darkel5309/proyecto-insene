// src/axiosConfig.js
import Axios from 'axios';

// Configuración global de Axios
Axios.defaults.baseURL = 'http://localhost:5174/api';
Axios.defaults.withCredentials = true;

export default Axios;
