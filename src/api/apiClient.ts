import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../constants/api';

const apiClient = axios.create({
  baseURL: API.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — add auth token
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor — handle errors
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Navigation to login will be handled by auth state
    }
    return Promise.reject(error);
  },
);

export default apiClient;
