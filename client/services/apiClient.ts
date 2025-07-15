import { ApiResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class ApiClient {
    private static async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse & { data: T }> {
        try {
            // Remove the extra slash - endpoint should already start with /
            const url = `${API_BASE_URL}${endpoint}`;
            console.log('Making request to:', url); // Debug log
            
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                mode: 'cors', // Explicitly set CORS mode
                credentials: 'omit', // Don't send credentials for now
                ...options,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            return response.json();
        } catch (error) {
            console.error('API request failed:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Network error: Unable to connect to the server. Please check if the server is running on http://localhost:8080');
            }
            throw error;
        }
    }

    static async get<T>(endpoint: string): Promise<ApiResponse & { data: T }> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    static async post<T>(endpoint: string, data: any): Promise<ApiResponse & { data: T }> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    static async put<T>(endpoint: string, data: any): Promise<ApiResponse & { data: T }> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    static async patch<T>(endpoint: string, data: any): Promise<ApiResponse & { data: T }> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    static async delete<T>(endpoint: string): Promise<ApiResponse & { data: T }> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}
