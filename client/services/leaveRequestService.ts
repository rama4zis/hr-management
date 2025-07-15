import { LeaveRequest, CreateLeaveRequestRequest } from '../types';
import { ApiResponse } from '../util/ApiResponse';
import { ApiClient } from './apiClient';

export class LeaveRequestService {
  private static readonly BASE_URL = '/leave-requests';

  // Get all leave requests (non-deleted)
  static async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/`);
    return response.data;
  }

  // Get all leave requests including deleted
  static async getAllLeaveRequestsIncludingDeleted(): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/all`);
    return response.data;
  }

  // Get leave request by ID
  static async getLeaveRequestById(id: string): Promise<LeaveRequest> {
    const response = await ApiClient.get<LeaveRequest>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  // Get leave requests by employee ID
  static async getLeaveRequestsByEmployeeId(employeeId: string): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/employee/${employeeId}`);
    return response.data;
  }

  // Get leave requests by status
  static async getLeaveRequestsByStatus(status: string): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/status/${status.toUpperCase()}`);
    return response.data;
  }

  // Get leave requests by type
  static async getLeaveRequestsByType(type: string): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/type/${type.toUpperCase()}`);
    return response.data;
  }

  // Get pending leave requests
  static async getPendingLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/pending`);
    return response.data;
  }

  // Get approved leave requests
  static async getApprovedLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/approved`);
    return response.data;
  }

  // Get rejected leave requests
  static async getRejectedLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/rejected`);
    return response.data;
  }

  // Get cancelled leave requests
  static async getCancelledLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/cancelled`);
    return response.data;
  }

  // Get leave requests by date range
  static async getLeaveRequestsByDateRange(startDate: string, endDate: string): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }

  // Get employee leave requests by date range
  static async getEmployeeLeaveRequestsByDateRange(employeeId: string, startDate: string, endDate: string): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/employee/${employeeId}/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }

  // Get leave requests by year
  static async getLeaveRequestsByYear(year: number): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/year/${year}`);
    return response.data;
  }

  // Get employee leave requests by year
  static async getEmployeeLeaveRequestsByYear(employeeId: string, year: number): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/employee/${employeeId}/year/${year}`);
    return response.data;
  }

  // Get leave requests by approver
  static async getLeaveRequestsByApprover(approverId: string): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/approver/${approverId}`);
    return response.data;
  }

  // Get upcoming approved leaves
  static async getUpcomingApprovedLeaves(): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/upcoming`);
    return response.data;
  }

  // Get current active leaves
  static async getCurrentActiveLeaves(): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/current-active`);
    return response.data;
  }

  // Get filtered leave requests (filtering by request date for month/year)
  static async getFiltered(filters: { month: number; year: number }): Promise<LeaveRequest[]> {
    // Get all leave requests first
    const allRequests = await this.getAllLeaveRequests();
    
    // Filter by request date month/year
    return allRequests.filter(request => {
      if (!request.requestDate) return false;
      
      const requestDate = new Date(request.requestDate);
      const requestYear = requestDate.getFullYear();
      const requestMonth = requestDate.getMonth() + 1; // JavaScript months are 0-indexed
      
      return requestYear === filters.year && requestMonth === filters.month;
    });
  }

  // Get leave request statistics (calculated from filtered data)
  static async getStats(filters: { month: number; year: number }): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalDays: number;
  }> {
    // Get filtered requests for the month/year
    const requests = await this.getFiltered(filters);
    
    // Calculate statistics
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.leaveRequestStatus === 'PENDING').length,
      approved: requests.filter(r => r.leaveRequestStatus === 'APPROVED').length,
      rejected: requests.filter(r => r.leaveRequestStatus === 'REJECTED').length,
      totalDays: requests
        .filter(r => r.leaveRequestStatus === 'APPROVED')
        .reduce((sum, r) => sum + (r.totalDays || 0), 0)
    };
    
    return stats;
  }

  // Create new leave request
  static async create(leaveRequestData: CreateLeaveRequestRequest): Promise<LeaveRequest> {
    const response = await ApiClient.post<LeaveRequest>(this.BASE_URL, leaveRequestData);
    return response.data;
  }

  // Update leave request (full update)
  static async update(id: string, leaveRequestData: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const response = await ApiClient.put<LeaveRequest>(`${this.BASE_URL}/${id}`, leaveRequestData);
    return response.data;
  }

  // Partial update leave request
  static async partialUpdate(id: string, leaveRequestData: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const response = await ApiClient.patch<LeaveRequest>(`${this.BASE_URL}/${id}`, leaveRequestData);
    return response.data;
  }

  // Approve leave request
  static async approve(id: string, approverId: string, comments?: string): Promise<LeaveRequest> {
    const response = await ApiClient.put<LeaveRequest>(`${this.BASE_URL}/${id}/approve`, {
      approverId,
      comments
    });
    return response.data;
  }

  // Reject leave request
  static async reject(id: string, approverId: string, comments?: string): Promise<LeaveRequest> {
    const response = await ApiClient.put<LeaveRequest>(`${this.BASE_URL}/${id}/reject`, {
      approverId,
      comments
    });
    return response.data;
  }

  // Cancel leave request
  static async cancel(id: string, reason?: string): Promise<LeaveRequest> {
    const response = await ApiClient.put<LeaveRequest>(`${this.BASE_URL}/${id}/cancel`, {
      reason
    });
    return response.data;
  }

  // Soft delete leave request
  static async deleteLeaveRequest(id: string): Promise<void> {
    await ApiClient.delete(`${this.BASE_URL}/${id}`);
  }

  // Hard delete leave request (permanent)
  static async permanentDeleteLeaveRequest(id: string): Promise<void> {
    await ApiClient.delete(`${this.BASE_URL}/${id}/permanent`);
  }

  // Restore soft deleted leave request
  static async restoreLeaveRequest(id: string): Promise<LeaveRequest> {
    const response = await ApiClient.put<LeaveRequest>(`${this.BASE_URL}/${id}/restore`, {});
    return response.data;
  }

  // Get total leave days taken by employee, type and year
  static async getTotalLeaveDays(employeeId: string, type: string, year: number): Promise<number> {
    const response = await ApiClient.get<number>(`${this.BASE_URL}/employee/${employeeId}/total-days?type=${type.toUpperCase()}&year=${year}`);
    return response.data;
  }

  // Get leave request count
  static async getLeaveRequestCount(): Promise<number> {
    const response = await ApiClient.get<number>(`${this.BASE_URL}/count`);
    return response.data;
  }

  // Get leave request count by status
  static async getLeaveRequestCountByStatus(status: string): Promise<number> {
    const response = await ApiClient.get<number>(`${this.BASE_URL}/count/status/${status.toUpperCase()}`);
    return response.data;
  }

  // Get leave request count by type
  static async getLeaveRequestCountByType(type: string): Promise<number> {
    const response = await ApiClient.get<number>(`${this.BASE_URL}/count/type/${type.toUpperCase()}`);
    return response.data;
  }

  // Get deleted leave requests
  static async getDeletedLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await ApiClient.get<LeaveRequest[]>(`${this.BASE_URL}/deleted`);
    return response.data;
  }

  // Bulk delete leave requests (using POST since DELETE with body is complex)
  static async bulkDeleteLeaveRequests(leaveRequestIds: string[]): Promise<number> {
    // Note: Using POST as a workaround since DELETE with body is not standard in fetch
    const response = await ApiClient.post<number>(`${this.BASE_URL}/bulk-delete`, leaveRequestIds);
    return response.data;
  }
}
