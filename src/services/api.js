import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  // baseURL: `/api`,
  headers: {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
  },
});

api.interceptors.request.use(
  (config) => {
    const res = JSON.parse(localStorage.getItem('user'));
    // console.log('middleware res', res);

    if (res && res.token) {
      config.headers.Authorization = `Bearer ${res.token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
