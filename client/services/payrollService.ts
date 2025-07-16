import { Payroll, CreatePayrollRequest, UpdatePayrollRequest, PayrollStatus, BulkCreatePayrollRequest } from '../types/Payroll';
import { ApiResponse } from '../util/ApiResponse';
import { ApiClient } from './apiClient';

export class PayrollService {
  private static readonly BASE_URL = '/payroll';

  // Get all payroll records (non-deleted)
  static async getAllPayrolls(): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}`);
    return response.data;
  }

  // Get payroll by ID
  static async getPayrollById(id: string): Promise<Payroll> {
    const response = await ApiClient.get<Payroll>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  // Get payroll records by employee ID
  static async getPayrollsByEmployeeId(employeeId: string): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/employee/${employeeId}`);
    return response.data;
  }

  // Get payroll records by status
  static async getPayrollsByStatus(status: PayrollStatus): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/status/${status}`);
    return response.data;
  }

  // Get pending payroll records
  static async getPendingPayrolls(): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/pending`);
    return response.data;
  }

  // Get approved payroll records
  static async getApprovedPayrolls(): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/approved`);
    return response.data;
  }

  // Get completed payroll records
  static async getCompletedPayrolls(): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/completed`);
    return response.data;
  }

  // Get draft payroll records
  static async getDraftPayrolls(): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/draft`);
    return response.data;
  }

  // Get failed payroll records
  static async getFailedPayrolls(): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/failed`);
    return response.data;
  }

  // Get overdue payroll records
  static async getOverduePayrolls(): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/overdue`);
    return response.data;
  }

  // Get payroll records by date range
  static async getPayrollsByDateRange(startDate: string, endDate: string): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }

  // Get payroll records by employee and date range
  static async getPayrollsByEmployeeAndDateRange(employeeId: string, startDate: string, endDate: string): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/employee/${employeeId}/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }

  // Get payroll records by year
  static async getPayrollsByYear(year: number): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/year/${year}`);
    return response.data;
  }

  // Get payroll records by month and year
  static async getPayrollsByMonthAndYear(month: number, year: number): Promise<Payroll[]> {
    const response = await ApiClient.get<Payroll[]>(`${this.BASE_URL}/month/${month}/year/${year}`);
    return response.data;
  }

  // Get filtered payroll records (client-side filtering by pay period)
  static async getFiltered(filters: { month: number; year: number }): Promise<Payroll[]> {
    // Use server-side filtering by month and year
    return this.getPayrollsByMonthAndYear(filters.month, filters.year);
  }

  // Get payroll statistics
  static async getStats(filters: { month: number; year: number }): Promise<{
    total: number;
    draft: number;
    pending: number;
    approved: number;
    processing: number;
    completed: number;
    failed: number;
    totalGrossPay: number;
    totalNetPay: number;
    totalDeductions: number;
    totalBonus: number;
  }> {
    // Get filtered payrolls for the month/year
    const payrolls = await this.getFiltered(filters);
    
    // Calculate statistics
    const stats = {
      total: payrolls.length,
      draft: payrolls.filter(p => p.payrollStatus === PayrollStatus.DRAFT).length,
      pending: payrolls.filter(p => p.payrollStatus === PayrollStatus.PENDING).length,
      approved: payrolls.filter(p => p.payrollStatus === PayrollStatus.APPROVED).length,
      processing: payrolls.filter(p => p.payrollStatus === PayrollStatus.PROCESSING).length,
      completed: payrolls.filter(p => p.payrollStatus === PayrollStatus.COMPLETED).length,
      failed: payrolls.filter(p => p.payrollStatus === PayrollStatus.FAILED).length,
      totalGrossPay: payrolls.reduce((sum, p) => sum + (p.salary + p.bonus), 0),
      totalNetPay: payrolls.reduce((sum, p) => sum + p.netPay, 0),
      totalDeductions: payrolls.reduce((sum, p) => sum + p.deductions, 0),
      totalBonus: payrolls.reduce((sum, p) => sum + p.bonus, 0),
    };
    
    return stats;
  }

  // Get payroll count by status
  static async getPayrollCountByStatus(status: PayrollStatus): Promise<number> {
    const response = await ApiClient.get<number>(`${this.BASE_URL}/count/status/${status}`);
    return response.data;
  }

  // Get total payroll amount by status
  static async getTotalPayrollAmountByStatus(status: PayrollStatus): Promise<number> {
    const response = await ApiClient.get<number>(`${this.BASE_URL}/total/status/${status}`);
    return response.data;
  }

  // Get total salary paid by employee
  static async getTotalSalaryPaidByEmployee(employeeId: string): Promise<number> {
    const response = await ApiClient.get<number>(`${this.BASE_URL}/employee/${employeeId}/total-paid`);
    return response.data;
  }

  // Get total salary paid by employee and year
  static async getTotalSalaryPaidByEmployeeAndYear(employeeId: string, year: number): Promise<number> {
    const response = await ApiClient.get<number>(`${this.BASE_URL}/employee/${employeeId}/year/${year}/total-paid`);
    return response.data;
  }

  // Create new payroll record
  static async create(payrollData: CreatePayrollRequest): Promise<Payroll> {
    const response = await ApiClient.post<Payroll>(`${this.BASE_URL}`, payrollData);
    return response.data;
  }

  // Update payroll record
  static async update(id: string, payrollData: UpdatePayrollRequest): Promise<Payroll> {
    const response = await ApiClient.put<Payroll>(`${this.BASE_URL}/${id}`, payrollData);
    return response.data;
  }

  // Approve payroll
  static async approve(id: string): Promise<Payroll> {
    const response = await ApiClient.put<Payroll>(`${this.BASE_URL}/${id}/approve`, {});
    return response.data;
  }

  // Reject payroll
  static async reject(id: string, reason?: string): Promise<Payroll> {
    const response = await ApiClient.put<Payroll>(`${this.BASE_URL}/${id}/reject`, { reason });
    return response.data;
  }

  // Submit payroll for approval
  static async submit(id: string): Promise<Payroll> {
    const response = await ApiClient.put<Payroll>(`${this.BASE_URL}/${id}/submit`, {});
    return response.data;
  }

  // Process payroll
  static async process(id: string): Promise<Payroll> {
    const response = await ApiClient.put<Payroll>(`${this.BASE_URL}/${id}/process`, {});
    return response.data;
  }

  // Complete payroll
  static async complete(id: string): Promise<Payroll> {
    const response = await ApiClient.put<Payroll>(`${this.BASE_URL}/${id}/complete`, {});
    return response.data;
  }

  // Mark payroll as failed
  static async fail(id: string, reason?: string): Promise<Payroll> {
    const response = await ApiClient.put<Payroll>(`${this.BASE_URL}/${id}/fail`, { reason });
    return response.data;
  }

  // Delete payroll record (soft delete)
  static async deletePayroll(id: string): Promise<void> {
    await ApiClient.delete(`${this.BASE_URL}/${id}`);
  }

  // Bulk create payroll records
  static async bulkCreate(payrollsData: BulkCreatePayrollRequest): Promise<Payroll[]> {
    const response = await ApiClient.post<Payroll[]>(`${this.BASE_URL}/bulk-create`, payrollsData);
    return response.data;
  }

  // Bulk approve payroll records
  static async bulkApprove(payrollIds: string[]): Promise<Payroll[]> {
    const response = await ApiClient.put<Payroll[]>(`${this.BASE_URL}/bulk-approve`, { payrollIds });
    return response.data;
  }
}
