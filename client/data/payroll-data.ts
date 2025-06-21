export interface Payroll {
  id: number;
  employeeId: number;
  employeeName: string;
  payPeriod: string;
  payDate: string;
  baseSalary: number;
  overtimePay: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: 'Pending' | 'Processed' | 'Paid';
}

export const payrollData: Payroll[] = [
  // June 2025 (Current month)
  { id: 1, employeeId: 1, employeeName: "John Doe", payPeriod: "2025-06-01 to 2025-06-30", payDate: "2025-07-01", baseSalary: 8333, overtimePay: 712.50, bonus: 2000, deductions: 1500, netPay: 9545.50, status: "Pending" },
  { id: 2, employeeId: 2, employeeName: "Sarah Johnson", payPeriod: "2025-06-01 to 2025-06-30", payDate: "2025-07-01", baseSalary: 9167, overtimePay: 0, bonus: 1500, deductions: 1800, netPay: 8867, status: "Processed" },
  { id: 3, employeeId: 3, employeeName: "Michael Chen", payPeriod: "2025-06-01 to 2025-06-30", payDate: "2025-07-01", baseSalary: 7083, overtimePay: 318.75, bonus: 1000, deductions: 1400, netPay: 7001.75, status: "Pending" },
  { id: 4, employeeId: 4, employeeName: "Emily Rodriguez", payPeriod: "2025-06-01 to 2025-06-30", payDate: "2025-07-01", baseSalary: 5417, overtimePay: 0, bonus: 800, deductions: 1100, netPay: 5117, status: "Processed" },
  { id: 5, employeeId: 5, employeeName: "David Wilson", payPeriod: "2025-06-01 to 2025-06-30", payDate: "2025-07-01", baseSalary: 7500, overtimePay: 810, bonus: 3000, deductions: 1600, netPay: 9710, status: "Pending" },

  // May 2025
  { id: 6, employeeId: 1, employeeName: "John Doe", payPeriod: "2025-05-01 to 2025-05-31", payDate: "2025-06-01", baseSalary: 8333, overtimePay: 500, bonus: 0, deductions: 1500, netPay: 7333, status: "Paid" },
  { id: 7, employeeId: 2, employeeName: "Sarah Johnson", payPeriod: "2025-05-01 to 2025-05-31", payDate: "2025-06-01", baseSalary: 9167, overtimePay: 200, bonus: 1000, deductions: 1800, netPay: 8567, status: "Paid" },
  { id: 8, employeeId: 3, employeeName: "Michael Chen", payPeriod: "2025-05-01 to 2025-05-31", payDate: "2025-06-01", baseSalary: 7083, overtimePay: 0, bonus: 500, deductions: 1400, netPay: 6183, status: "Paid" },
  { id: 9, employeeId: 4, employeeName: "Emily Rodriguez", payPeriod: "2025-05-01 to 2025-05-31", payDate: "2025-06-01", baseSalary: 5417, overtimePay: 150, bonus: 0, deductions: 1100, netPay: 4467, status: "Paid" },
  { id: 10, employeeId: 5, employeeName: "David Wilson", payPeriod: "2025-05-01 to 2025-05-31", payDate: "2025-06-01", baseSalary: 7500, overtimePay: 600, bonus: 1500, deductions: 1600, netPay: 8000, status: "Paid" },

  // April 2025
  { id: 11, employeeId: 1, employeeName: "John Doe", payPeriod: "2025-04-01 to 2025-04-30", payDate: "2025-05-01", baseSalary: 8333, overtimePay: 400, bonus: 1000, deductions: 1500, netPay: 8233, status: "Paid" },
  { id: 12, employeeId: 2, employeeName: "Sarah Johnson", payPeriod: "2025-04-01 to 2025-04-30", payDate: "2025-05-01", baseSalary: 9167, overtimePay: 0, bonus: 2000, deductions: 1800, netPay: 9367, status: "Paid" },
  { id: 13, employeeId: 3, employeeName: "Michael Chen", payPeriod: "2025-04-01 to 2025-04-30", payDate: "2025-05-01", baseSalary: 7083, overtimePay: 250, bonus: 800, deductions: 1400, netPay: 6733, status: "Paid" },
  { id: 14, employeeId: 4, employeeName: "Emily Rodriguez", payPeriod: "2025-04-01 to 2025-04-30", payDate: "2025-05-01", baseSalary: 5417, overtimePay: 100, bonus: 500, deductions: 1100, netPay: 4917, status: "Paid" },
  { id: 15, employeeId: 5, employeeName: "David Wilson", payPeriod: "2025-04-01 to 2025-04-30", payDate: "2025-05-01", baseSalary: 7500, overtimePay: 300, bonus: 1200, deductions: 1600, netPay: 7400, status: "Paid" },

  // March 2025
  { id: 16, employeeId: 1, employeeName: "John Doe", payPeriod: "2025-03-01 to 2025-03-31", payDate: "2025-04-01", baseSalary: 8333, overtimePay: 600, bonus: 500, deductions: 1500, netPay: 7933, status: "Paid" },
  { id: 17, employeeId: 2, employeeName: "Sarah Johnson", payPeriod: "2025-03-01 to 2025-03-31", payDate: "2025-04-01", baseSalary: 9167, overtimePay: 300, bonus: 1500, deductions: 1800, netPay: 9167, status: "Paid" },
  { id: 18, employeeId: 3, employeeName: "Michael Chen", payPeriod: "2025-03-01 to 2025-03-31", payDate: "2025-04-01", baseSalary: 7083, overtimePay: 200, bonus: 1000, deductions: 1400, netPay: 6883, status: "Paid" },
  { id: 19, employeeId: 4, employeeName: "Emily Rodriguez", payPeriod: "2025-03-01 to 2025-03-31", payDate: "2025-04-01", baseSalary: 5417, overtimePay: 0, bonus: 300, deductions: 1100, netPay: 4617, status: "Paid" },
  { id: 20, employeeId: 5, employeeName: "David Wilson", payPeriod: "2025-03-01 to 2025-03-31", payDate: "2025-04-01", baseSalary: 7500, overtimePay: 450, bonus: 2000, deductions: 1600, netPay: 8350, status: "Paid" }
];

export default payrollData; 