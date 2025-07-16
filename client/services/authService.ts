import { ApiClient } from './apiClient';
import { User, LoginRequest, LoginResponse, UserRole } from '../types/User';
import { ApiResponse } from '../types';

class AuthService {
  private static instance: AuthService;
  private user: Omit<User, 'password'> | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login method
  async login(username: string, password: string): Promise<Omit<User, 'password'>> {
    try {
      const response = await ApiClient.post<ApiResponse>('/users/login', {
        username,
        password,
      });

      if (response.status == true && response.message == 'Login successful') {
        this.user = response.data as unknown as Omit<User, 'password'>;
        // Store user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(this.user));

        // redirect to employees page
        if (typeof window !== 'undefined') {
          window.location.href = '/employees';
        }

        return this.user;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      await ApiClient.post('/users/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.user = null;
      localStorage.removeItem('user');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (this.user) {
      return true;
    }

    // Check localStorage for persisted user data
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Validate that the stored data has required fields
          if (userData && userData.id && userData.username && userData.employeeId) {
            this.user = userData;
            return true;
          } else {
            // Clean up invalid data
            localStorage.removeItem('user');
          }
        } catch (error) {
          // Clean up corrupted data
          localStorage.removeItem('user');
        }
      }
    }

    return false;
  }

  // Get current user
  getCurrentUser(): Omit<User, 'password'> | null {
    if (this.user) {
      return this.user;
    }

    // Check localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
          return this.user;
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
    }

    return null;
  }

  // Get current employee ID
  getCurrentEmployeeId(): string | null {
    const user = this.getCurrentUser();
    return user?.employeeId || null;
  }

  // Clear user data (for client-side logout)
  clearUserData(): void {
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
}

export const authService = AuthService.getInstance();
