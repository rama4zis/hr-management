import { ApiClient } from './apiClient';
import { Attendance, AttendanceStatus, CreateAttendanceRequest, UpdateAttendanceRequest } from '../types';

export class AttendanceService {
    static async getAllAttendance(): Promise<Attendance[]> {
        const response = await ApiClient.get<Attendance[]>('/attendance/');
        return response.data;
    }

    static async getAttendanceById(id: string): Promise<Attendance> {
        const response = await ApiClient.get<Attendance>(`/attendance/${id}`);
        return response.data;
    }

    static async getAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
        const response = await ApiClient.get<Attendance[]>(`/attendance/employee/${employeeId}`);
        return response.data;
    }

    static async getAttendanceByDateRange(startDate: string, endDate: string): Promise<Attendance[]> {
        const response = await ApiClient.get<Attendance[]>(`/attendance/date-range?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    }

    static async getAttendanceByMonth(year: number, month: number): Promise<Attendance[]> {
        const response = await ApiClient.get<Attendance[]>(`/attendance/month?year=${year}&month=${month}`);
        return response.data;
    }

    static async createAttendance(attendance: CreateAttendanceRequest): Promise<Attendance> {
        const response = await ApiClient.post<Attendance>('/attendance/', attendance);
        return response.data;
    }

    static async updateAttendance(id: string, attendance: UpdateAttendanceRequest): Promise<Attendance> {
        const response = await ApiClient.put<Attendance>(`/attendance/${id}`, attendance);
        return response.data;
    }

    static async deleteAttendance(id: string): Promise<void> {
        await ApiClient.delete(`/attendance/${id}`);
    }

    static async clockIn(employeeId: string): Promise<Attendance> {
        const response = await ApiClient.post<Attendance>('/attendance/clock-in/', { employeeId });
        return response.data;
    }

    static async clockOut(attendanceId: string): Promise<Attendance> {
        const response = await ApiClient.put<Attendance>(`/attendance/${attendanceId}/clock-out/`, {});
        return response.data;
    }
}
