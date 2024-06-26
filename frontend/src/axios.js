import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token:', token); // Log the token for debugging
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized. Token Required!'); // Log unauthorized errors for debugging
      // Redirect to login or handle unauthorized access here
    }
    return Promise.reject(error);
  }
);

export default instance;
