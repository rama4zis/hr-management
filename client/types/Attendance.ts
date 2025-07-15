import { BaseEntity } from "./Base";

export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE',
    HALF_DAY = 'HALF_DAY',
    OVERTIME = 'OVERTIME',
    WORK_FROM_HOME = 'WORK_FROM_HOME'
}

export interface Attendance extends BaseEntity {
    employeeId: string;
    date: string;
    clockIn: string;
    clockOut?: string;
    attendanceStatus: AttendanceStatus;
    notes?: string;
    // Computed fields
    hoursWorked?: number;
    isOvertime?: boolean;
}

export interface CreateAttendanceRequest {
    employeeId: string;
    date: string;
    clockIn: string;
    clockOut?: string;
    attendanceStatus?: AttendanceStatus;
    notes?: string;
}

export interface UpdateAttendanceRequest {
    clockOut?: string;
    attendanceStatus?: AttendanceStatus;
    notes?: string;
}

export interface ClockInRequest {
    employeeId: string;
}

export interface ClockOutRequest {
    attendanceId: string;
}
