import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1/umes',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
