import { BaseEntity } from "./Base";

export interface Department extends BaseEntity {
    name: string;
    description?: string;
    managerId?: string;
}

export interface CreateDepartmentRequest {
    name: string;
    description?: string;
    managerId?: string;
}

export interface UpdateDepartmentRequest {
    name?: string;
    description?: string;
    managerId?: string;
}