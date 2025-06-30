export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string; // Employee ID of approver
  requestDate: Date;
  responseDate?: Date;
  comments?: string;
}

export interface CreateLeaveRequestData {
  employeeId: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: Date;
  endDate: Date;
  reason: string;
}
