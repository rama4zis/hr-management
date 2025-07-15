import { ApiClient } from './apiClient';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../types';

export class EmployeeService {
    static async getAllEmployees(): Promise<Employee[]> {
        const response = await ApiClient.get<Employee[]>('/employees/');
        return response.data;
    }

    static async getEmployeeById(id: string): Promise<Employee> {
        const response = await ApiClient.get<Employee>(`/employees/${id}`);
        return response.data;
    }

    static async createEmployee(employee: CreateEmployeeRequest): Promise<Employee> {
        const response = await ApiClient.post<Employee>('/employees/', employee);
        return response.data;
    }

    static async updateEmployee(id: string, employee: UpdateEmployeeRequest): Promise<Employee> {
        const response = await ApiClient.put<Employee>(`/employees/${id}`, employee);
        return response.data;
    }

    static async deleteEmployee(id: string): Promise<void> {
        await ApiClient.delete(`/employees/${id}`);
    }

    static async searchEmployees(query: string): Promise<Employee[]> {
        const response = await ApiClient.get<Employee[]>(`/employees/search?query=${encodeURIComponent(query)}`);
        return response.data;
    }

    static async getEmployeesByDepartment(departmentId: string): Promise<Employee[]> {
        const response = await ApiClient.get<Employee[]>(`/employees/department/${departmentId}`);
        return response.data;
    }

    static async getEmployeesByStatus(status: string): Promise<Employee[]> {
        const response = await ApiClient.get<Employee[]>(`/employees/status/${status}`);
        return response.data;
    }

    static async activateEmployee(id: string): Promise<Employee> {
        const response = await ApiClient.put<Employee>(`/employees/${id}/activate/`, {});
        return response.data;
    }

    static async deactivateEmployee(id: string): Promise<Employee> {
        const response = await ApiClient.put<Employee>(`/employees/${id}/deactivate/`, {});
        return response.data;
    }
}
