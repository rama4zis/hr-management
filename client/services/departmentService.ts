import { ApiClient } from './apiClient';
import { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from '../types';

export class DepartmentService {
    static async getAllDepartments(): Promise<Department[]> {
        const response = await ApiClient.get<Department[]>('/departments/');
        return response.data;
    }

    static async getDepartmentById(id: string): Promise<Department> {
        const response = await ApiClient.get<Department>(`/departments/${id}`);
        return response.data;
    }

    static async createDepartment(department: CreateDepartmentRequest): Promise<Department> {
        const response = await ApiClient.post<Department>('/departments/', department);
        return response.data;
    }

    static async updateDepartment(id: string, department: UpdateDepartmentRequest): Promise<Department> {
        const response = await ApiClient.put<Department>(`/departments/${id}`, department);
        return response.data;
    }

    static async deleteDepartment(id: string): Promise<void> {
        await ApiClient.delete(`/departments/${id}`);
    }
}
