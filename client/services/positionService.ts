import { ApiClient } from './apiClient';
import { Position, CreatePositionRequest, UpdatePositionRequest } from '../types';

export class PositionService {
    static async getAllPositions(): Promise<Position[]> {
        const response = await ApiClient.get<Position[]>('/positions/');
        return response.data;
    }

    static async getPositionById(id: string): Promise<Position> {
        const response = await ApiClient.get<Position>(`/positions/${id}`);
        return response.data;
    }

    static async createPosition(position: CreatePositionRequest): Promise<Position> {
        const response = await ApiClient.post<Position>('/positions/', position);
        return response.data;
    }

    static async updatePosition(id: string, position: UpdatePositionRequest): Promise<Position> {
        const response = await ApiClient.put<Position>(`/positions/${id}`, position);
        return response.data;
    }

    static async deletePosition(id: string): Promise<void> {
        await ApiClient.delete(`/positions/${id}`);
    }

    static async getPositionsByDepartment(departmentId: string): Promise<Position[]> {
        const response = await ApiClient.get<Position[]>(`/positions/department/${departmentId}`);
        return response.data;
    }
}
