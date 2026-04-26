import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';
import {API} from '../constants/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'Parent' | 'Child';
  deviceId?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'Parent' | 'Child';
    name?: string;
  };
}

class AuthService {
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post(API.AUTH.LOGIN, request);
      const data = response.data;

      // Store token
      if (data.token) {
        await AsyncStorage.setItem('auth_token', data.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
      }

      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Giriş başarısız',
      );
    }
  }

  async register(request: RegisterRequest): Promise<void> {
    try {
      await apiClient.post(API.AUTH.REGISTER, request);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Kayıt başarısız',
      );
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('auth_token');
  }

  async getUser(): Promise<LoginResponse['user'] | null> {
    const data = await AsyncStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
