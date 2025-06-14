export interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  totalHours: number | null;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Remote';
}

export const attendanceData: Attendance[] = [
  { id: 1, employeeId: 1, employeeName: "John Doe", date: "2024-01-15", clockIn: "09:00", clockOut: "17:30", totalHours: 8.5, status: "Present" },
  { id: 2, employeeId: 1, employeeName: "John Doe", date: "2024-01-16", clockIn: "08:45", clockOut: "17:15", totalHours: 8.5, status: "Present" },
  { id: 3, employeeId: 1, employeeName: "John Doe", date: "2024-01-17", clockIn: "09:30", clockOut: "17:00", totalHours: 7.5, status: "Late" },
  { id: 4, employeeId: 2, employeeName: "Sarah Johnson", date: "2024-01-15", clockIn: "08:45", clockOut: "17:15", totalHours: 8.5, status: "Present" },
  { id: 5, employeeId: 2, employeeName: "Sarah Johnson", date: "2024-01-16", clockIn: "09:00", clockOut: "17:00", totalHours: 8.0, status: "Remote" },
  { id: 6, employeeId: 3, employeeName: "Michael Chen", date: "2024-01-15", clockIn: "09:00", clockOut: "17:00", totalHours: 8.0, status: "Remote" },
  { id: 7, employeeId: 3, employeeName: "Michael Chen", date: "2024-01-16", clockIn: "08:30", clockOut: "17:30", totalHours: 9.0, status: "Present" },
  { id: 8, employeeId: 4, employeeName: "Emily Rodriguez", date: "2024-01-15", clockIn: "08:30", clockOut: "17:30", totalHours: 9.0, status: "Present" },
  { id: 9, employeeId: 4, employeeName: "Emily Rodriguez", date: "2024-01-16", clockIn: "09:00", clockOut: "17:00", totalHours: 8.0, status: "Remote" },
  { id: 10, employeeId: 5, employeeName: "David Wilson", date: "2024-01-15", clockIn: "08:00", clockOut: "18:00", totalHours: 10.0, status: "Present" },
  { id: 11, employeeId: 5, employeeName: "David Wilson", date: "2024-01-16", clockIn: "08:30", clockOut: "17:30", totalHours: 9.0, status: "Present" },
  { id: 12, employeeId: 6, employeeName: "Lisa Thompson", date: "2024-01-15", clockIn: "08:30", clockOut: "17:30", totalHours: 9.0, status: "Present" },
  { id: 13, employeeId: 6, employeeName: "Lisa Thompson", date: "2024-01-16", clockIn: "08:45", clockOut: "17:15", totalHours: 8.5, status: "Present" },
  { id: 14, employeeId: 7, employeeName: "Robert Kim", date: "2024-01-15", clockIn: "09:00", clockOut: "17:00", totalHours: 8.0, status: "Remote" },
  { id: 15, employeeId: 7, employeeName: "Robert Kim", date: "2024-01-16", clockIn: "08:30", clockOut: "17:30", totalHours: 9.0, status: "Present" },

  { id: 16, employeeId: 1, employeeName: "John Doe", date: "2025-06-12", clockIn: "09:00", clockOut: "17:30", totalHours: 8.5, status: "Present" },
  { id: 17, employeeId: 1, employeeName: "John Doe", date: "2025-06-13", clockIn: "09:00", clockOut: "17:30", totalHours: 8.5, status: "Present" },
  { id: 18, employeeId: 1, employeeName: "John Doe", date: "2025-06-14", clockIn: "09:00", clockOut: "17:30", totalHours: 8.5, status: "Present" },

];

export default attendanceData; 