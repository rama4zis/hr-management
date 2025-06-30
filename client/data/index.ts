// Export all dummy data from a single file for easy imports
export * from './dummyDepartments';
export * from './dummyPositions';
export * from './dummyEmployees';
export * from './dummyAttendance';
export * from './dummyLeaveRequests';
export * from './dummyPayroll';

// Combined data object for easy access
import { dummyDepartments } from './dummyDepartments';
import { dummyPositions } from './dummyPositions';
import { dummyEmployees } from './dummyEmployees';
import { dummyAttendance } from './dummyAttendance';
import { dummyLeaveRequests } from './dummyLeaveRequests';
import { dummyPayroll } from './dummyPayroll';

export const dummyData = {
  departments: dummyDepartments,
  positions: dummyPositions,
  employees: dummyEmployees,
  attendance: dummyAttendance,
  leaveRequests: dummyLeaveRequests,
  payroll: dummyPayroll,
};

// Helper functions to get related data
export const getEmployeesByDepartment = (departmentId: string) => {
  return dummyEmployees.filter(emp => emp.departmentId === departmentId);
};

export const getPositionsByDepartment = (departmentId: string) => {
  return dummyPositions.filter(pos => pos.departmentId === departmentId);
};

export const getAttendanceByEmployee = (employeeId: string) => {
  return dummyAttendance.filter(att => att.employeeId === employeeId);
};

export const getLeaveRequestsByEmployee = (employeeId: string) => {
  return dummyLeaveRequests.filter(leave => leave.employeeId === employeeId);
};

export const getPayrollByEmployee = (employeeId: string) => {
  return dummyPayroll.filter(pay => pay.employeeId === employeeId);
};

export const getDepartmentName = (departmentId: string) => {
  return dummyDepartments.find(dept => dept.id === departmentId)?.name || 'Unknown';
};

export const getPositionTitle = (positionId: string) => {
  return dummyPositions.find(pos => pos.id === positionId)?.title || 'Unknown';
};

export const getEmployeeName = (employeeId: string) => {
  const employee = dummyEmployees.find(emp => emp.id === employeeId);
  return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
};
