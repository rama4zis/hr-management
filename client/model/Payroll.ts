export interface Payroll {
  id: string;
  employeeId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  grossPay: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
  processedDate?: Date;
  paidDate?: Date;
}

export interface CreatePayrollData {
  employeeId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
}
