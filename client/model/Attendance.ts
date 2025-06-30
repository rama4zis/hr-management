export interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  totalHours: number;
  status: 'present' | 'late' | 'absent' | 'half-day';
  notes?: string;
}

export interface CreateAttendanceData {
  employeeId: string;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  status: 'present' | 'late' | 'absent' | 'half-day';
  notes?: string;
}
