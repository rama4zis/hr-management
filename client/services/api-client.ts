import { env } from "process";
import { ApiResponse } from "util/ApiResponse";

export class ApiClient {
    private static async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse & {data: T}> {
        const response = await fetch(env.API_BASE_URL + endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    static async get<T>(endpoint: string): Promise<ApiResponse & {data: T}> {
        return this.request<T>(endpoint, {
            method: 'GET'
        });
    }

    static async post<T>(endpoint: string, body: object): Promise<ApiResponse & {data: T}> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    static async put<T>(endpoint: string, body: object): Promise<ApiResponse & {data: T}> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    static async delete<T>(endpoint: string): Promise<ApiResponse & {data: T}> {
        return this.request<T>(endpoint, {
            method: 'DELETE'
        });
    }
}