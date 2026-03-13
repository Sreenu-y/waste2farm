import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Expo, localhost points to the device, so we need to use the computer's local IP address.
// Change this to your actual local IPv4 address during testing, e.g., 'http://192.168.1.10:3000'
// Or use ngrok for a public tunnel.
// Note: Android emulator uses 10.0.2.2 for localhost.
// Update this to your computer's local IPv4 address for physical device testing.
// You can find your IP by running 'ipconfig' in the terminal.
export const BASE_URL = 'http://10.35.248.157:3000/api';

console.log('🌐 API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Failed to get token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with an error
      console.error('API Server Error:', error.response.status, error.response.data);
      const customError = error.response.data?.error || `Server Error: ${error.response.status}`;
      return Promise.reject(new Error(customError));
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Network Error (No Response):', error.request);
      return Promise.reject(new Error('Network error: Backend unreachable. Check IP and Wi-Fi.'));
    } else {
      // Something happened in setting up the request
      console.error('API Setup Error:', error.message);
      return Promise.reject(new Error(error.message));
    }
  }
);

export default api;
