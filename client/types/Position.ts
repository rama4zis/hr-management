import { BaseEntity } from "./Base";

export interface Position extends BaseEntity {
    title: string;
    description?: string;
    departmentId: string;
}

export interface CreatePositionRequest {
    title: string;
    description?: string;
    departmentId: string;
}

export interface UpdatePositionRequest {
    title?: string;
    description?: string;
    departmentId?: string;
}
