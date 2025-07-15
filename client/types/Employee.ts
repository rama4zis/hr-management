import { BaseEntity } from "./Base";

export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    TERMINATED = 'TERMINATED',
    ON_LEAVE = 'ON_LEAVE',
    PROBATION = 'PROBATION'
}

export interface Employee extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    departmentId: string;
    positionId: string;
    hireDate: string;
    salary: number;
    employeeStatus: EmployeeStatus;
    profileImage?: string;
    // Computed fields from backend
    fullName: string;
    yearsOfService: number;
    active: boolean;
}

export interface CreateEmployeeRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    departmentId: string;
    positionId: string;
    hireDate: string;
    salary: number;
    employeeStatus?: EmployeeStatus;
    profileImage?: string;
}

export interface UpdateEmployeeRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    departmentId?: string;
    positionId?: string;
    hireDate?: string;
    salary?: number;
    employeeStatus?: EmployeeStatus;
    profileImage?: string;
}