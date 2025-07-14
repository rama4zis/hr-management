import { BaseEntity } from "./Base";

export interface Department extends BaseEntity {
    name: string;
    description?: string;
    managerId?: string;
}