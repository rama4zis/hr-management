import { BaseEntity } from "./Base";

export enum PayrollStatus {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface Payroll extends BaseEntity {
    employeeId: string;
    payPeriodStart: string;
    payPeriodEnd: string;
    salary: number;
    bonus: number;
    deductions: number;
    netPay: number;
    payrollStatus: PayrollStatus;
    processedDate?: string;
    paidDate?: string;
}

export interface CreatePayrollRequest {
    employeeId: string;
    payPeriodStart: string;
    payPeriodEnd: string;
    salary: number;
    bonus?: number;
    deductions?: number;
    payrollStatus?: PayrollStatus;
}

export interface UpdatePayrollRequest {
    salary?: number;
    bonus?: number;
    deductions?: number;
    payrollStatus?: PayrollStatus;
}

export interface BulkCreatePayrollRequest {
    payrolls: CreatePayrollRequest[];
}

export interface PayrollSummary {
    totalSalary: number;
    totalBonus: number;
    totalDeductions: number;
    totalNetPay: number;
    payrollCount: number;
}
