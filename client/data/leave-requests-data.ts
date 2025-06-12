export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'Vacation' | 'Sick' | 'Personal' | 'Maternity' | 'Paternity' | 'Bereavement';
  startDate: string;
  endDate: string;
  totalDays: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedDate: string;
}

export const leaveRequestsData: LeaveRequest[] = [
  { id: 1, employeeId: 1, employeeName: "John Doe", leaveType: "Vacation", startDate: "2024-02-15", endDate: "2024-02-20", totalDays: 5, status: "Approved", requestedDate: "2024-01-10" },
  { id: 2, employeeId: 2, employeeName: "Sarah Johnson", leaveType: "Sick", startDate: "2024-01-22", endDate: "2024-01-23", totalDays: 2, status: "Approved", requestedDate: "2024-01-21" },
  { id: 3, employeeId: 3, employeeName: "Michael Chen", leaveType: "Personal", startDate: "2024-01-25", endDate: "2024-01-25", totalDays: 1, status: "Approved", requestedDate: "2024-01-20" },
  { id: 4, employeeId: 4, employeeName: "Emily Rodriguez", leaveType: "Vacation", startDate: "2024-03-10", endDate: "2024-03-15", totalDays: 5, status: "Pending", requestedDate: "2024-01-15" },
  { id: 5, employeeId: 5, employeeName: "David Wilson", leaveType: "Bereavement", startDate: "2024-01-30", endDate: "2024-02-02", totalDays: 3, status: "Approved", requestedDate: "2024-01-28" },
  { id: 6, employeeId: 6, employeeName: "Lisa Thompson", leaveType: "Vacation", startDate: "2024-04-15", endDate: "2024-04-19", totalDays: 4, status: "Approved", requestedDate: "2024-01-05" },
  { id: 7, employeeId: 7, employeeName: "Robert Kim", leaveType: "Sick", startDate: "2024-01-18", endDate: "2024-01-19", totalDays: 2, status: "Approved", requestedDate: "2024-01-17" },
  { id: 8, employeeId: 8, employeeName: "Jennifer Lee", leaveType: "Personal", startDate: "2024-02-01", endDate: "2024-02-01", totalDays: 1, status: "Approved", requestedDate: "2024-01-25" },
  { id: 9, employeeId: 9, employeeName: "Christopher Brown", leaveType: "Vacation", startDate: "2024-05-20", endDate: "2024-05-24", totalDays: 4, status: "Pending", requestedDate: "2024-01-20" },
  { id: 10, employeeId: 10, employeeName: "Amanda Garcia", leaveType: "Sick", startDate: "2024-01-24", endDate: "2024-01-24", totalDays: 1, status: "Approved", requestedDate: "2024-01-24" }
];

export default leaveRequestsData; 