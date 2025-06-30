// Export all models from a single file for easy imports
export * from './Employee';
export * from './Department';
export * from './Position';
export * from './Attendance';
export * from './LeaveRequest';
export * from './Payroll';

// Common types used across models
export type Status = 'active' | 'inactive';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type PayrollStatus = 'draft' | 'processed' | 'paid';
export type AttendanceStatus = 'present' | 'late' | 'absent' | 'half-day';
export type LeaveType = 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
