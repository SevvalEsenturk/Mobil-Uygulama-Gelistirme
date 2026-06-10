import { Platform } from 'react-native';

const getBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return '/api';
  }
  // Android emulator loopback IP is 10.0.2.2.
  // For physical Android/iOS devices, replace this with your computer's local IP (e.g. 'http://192.168.1.100:5000/api')
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  // iOS simulator
  return 'http://localhost:5000/api';
};

export const API = {
  BASE_URL: getBaseUrl(),

  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },

  // User endpoints
  USERS: {
    PROFILE: '/users/profile',
    CHILDREN: (parentId: string) => `/users/${parentId}/children`,
  },

  // Rules endpoints
  RULES: {
    BLOCK_RULES: '/rules/block',
    TIME_RESTRICTIONS: '/rules/time-restrictions',
  },

  // Usage endpoints
  USAGE: {
    STATS: '/usage/stats',
    DAILY_SUMMARY: '/usage/daily-summary',
  },

  // Pairing endpoints
  PAIRING: {
    GENERATE_CODE: '/pairing/generate',
    PAIR_DEVICE: '/pairing/pair',
  },
};
