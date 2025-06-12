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
  { id: 1, employeeId: 1, employeeName: "John Doe", payPeriod: "2024-01-01 to 2024-01-31", payDate: "2024-02-01", baseSalary: 95000, overtimePay: 712.50, bonus: 2000, deductions: 15000, netPay: 84712.50, status: "Paid" },
  { id: 2, employeeId: 2, employeeName: "Sarah Johnson", payPeriod: "2024-01-01 to 2024-01-31", payDate: "2024-02-01", baseSalary: 110000, overtimePay: 0, bonus: 1500, deductions: 18000, netPay: 93500, status: "Paid" },
  { id: 3, employeeId: 3, employeeName: "Michael Chen", payPeriod: "2024-01-01 to 2024-01-31", payDate: "2024-02-01", baseSalary: 85000, overtimePay: 318.75, bonus: 1000, deductions: 14000, netPay: 72318.75, status: "Paid" },
  { id: 4, employeeId: 4, employeeName: "Emily Rodriguez", payPeriod: "2024-01-01 to 2024-01-31", payDate: "2024-02-01", baseSalary: 65000, overtimePay: 0, bonus: 800, deductions: 11000, netPay: 54800, status: "Paid" },
  { id: 5, employeeId: 5, employeeName: "David Wilson", payPeriod: "2024-01-01 to 2024-01-31", payDate: "2024-02-01", baseSalary: 90000, overtimePay: 810, bonus: 3000, deductions: 16000, netPay: 77810, status: "Paid" },
  { id: 6, employeeId: 6, employeeName: "Lisa Thompson", payPeriod: "2024-01-01 to 2024-01-31", payDate: "2024-02-01", baseSalary: 55000, overtimePay: 0, bonus: 500, deductions: 9000, netPay: 46500, status: "Paid" },
  { id: 7, employeeId: 7, employeeName: "Robert Kim", payPeriod: "2024-01-01 to 2024-01-31", payDate: "2024-02-01", baseSalary: 75000, overtimePay: 337.50, bonus: 1200, deductions: 13000, netPay: 63537.50, status: "Paid" },
  { id: 8, employeeId: 8, employeeName: "Jennifer Lee", payPeriod: "2024-01-01 to 2024-01-31", payDate: "2024-02-01", baseSalary: 80000, overtimePay: 0, bonus: 1000, deductions: 14000, netPay: 67000, status: "Paid" },
  { id: 9, employeeId: 9, employeeName: "Christopher Brown", payPeriod: "2024-01-01 to 2024-01-31", payDate: "2024-02-01", baseSalary: 85000, overtimePay: 573.75, bonus: 1500, deductions: 15000, netPay: 72073.75, status: "Paid" },
  { id: 10, employeeId: 10, employeeName: "Amanda Garcia", payPeriod: "2024-01-01 to 2024-01-31", payDate: "2024-02-01", baseSalary: 60000, overtimePay: 315, bonus: 600, deductions: 10000, netPay: 50915, status: "Paid" }
];

export default payrollData; 