import { BaseEntity } from "./Base";

export enum LeaveRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED'
}

export enum LeaveRequestType {
    ANNUAL = 'ANNUAL',
    SICK = 'SICK',
    PERSONAL = 'PERSONAL',
    MATERNITY = 'MATERNITY',
    PATERNITY = 'PATERNITY',
    BEREAVEMENT = 'BEREAVEMENT',
    EMERGENCY = 'EMERGENCY'
}

export interface LeaveRequest extends BaseEntity {
    employeeId: string;
    leaveRequestType: LeaveRequestType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason?: string;
    leaveRequestStatus: LeaveRequestStatus;
    approvedBy?: string;
    requestDate: string;
    responseDate?: string;
    comments?: string;
}

export interface CreateLeaveRequestRequest {
    employeeId: string;
    leaveRequestType: LeaveRequestType;
    startDate: string;
    endDate: string;
    reason?: string;
}

export interface UpdateLeaveRequestRequest {
    leaveRequestType?: LeaveRequestType;
    startDate?: string;
    endDate?: string;
    reason?: string;
}

export interface ApproveLeaveRequestRequest {
    leaveRequestId: string;
    approvedBy: string;
    comments?: string;
}

export interface RejectLeaveRequestRequest {
    leaveRequestId: string;
    rejectedBy: string;
    comments?: string;
}
