export const API = {
  BASE_URL: 'http://localhost:5000/api',

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
