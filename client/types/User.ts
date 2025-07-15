import { BaseEntity } from "./Base";

export enum UserRole {
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE',
    HR = 'HR'
}

export interface User extends BaseEntity {
    username: string;
    password: string;
    employeeId: string;
    userRole: UserRole;
    isActive: boolean;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    employeeId: string;
    userRole: UserRole;
}

export interface UpdateUserRequest {
    username?: string;
    password?: string;
    userRole?: UserRole;
    isActive?: boolean;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: Omit<User, 'password'>;
    token?: string;
    message: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
