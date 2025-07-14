import { BaseEntity } from "./Base";

export interface Position extends BaseEntity {
    title: string;
    description: string;
    departmentId: string;
}
