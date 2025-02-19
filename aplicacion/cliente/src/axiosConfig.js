import Axios from 'axios';

Axios.defaults.baseURL = 'http://localhost:5174/api';
Axios.defaults.withCredentials = true;

export default Axios;
