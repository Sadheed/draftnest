// client/src/api/axios.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Matches your Express server port
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Attach Bearer token to all requests
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;