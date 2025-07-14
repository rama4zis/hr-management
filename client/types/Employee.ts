import { BaseEntity } from "./Base";

export interface Employee extends BaseEntity {
    firstName: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    departmentId: string;
    positionId: string;
    hireDate?: string;
    salary?: number;
    employmentStatus?: 'active' | 'inactive' | 'terminated';
    profileImage?: string;
}