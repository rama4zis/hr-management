export interface Department {
  id: number;
  name: string;
  code: string;
  managerId: number;
  employeeCount: number;
  status: 'Active' | 'Inactive';
}

export const departmentsData: Department[] = [
  { id: 1, name: "Engineering", code: "ENG", managerId: 1, employeeCount: 25, status: "Active" },
  { id: 2, name: "Product", code: "PROD", managerId: 2, employeeCount: 8, status: "Active" },
  { id: 3, name: "Design", code: "DESIGN", managerId: 3, employeeCount: 6, status: "Active" },
  { id: 4, name: "Marketing", code: "MKTG", managerId: 4, employeeCount: 12, status: "Active" },
  { id: 5, name: "Sales", code: "SALES", managerId: 5, employeeCount: 15, status: "Active" },
  { id: 6, name: "Human Resources", code: "HR", managerId: 6, employeeCount: 8, status: "Active" },
  { id: 7, name: "Analytics", code: "ANALYTICS", managerId: 7, employeeCount: 6, status: "Active" },
  { id: 8, name: "Customer Success", code: "CS", managerId: 12, employeeCount: 10, status: "Active" },
  { id: 9, name: "IT", code: "IT", managerId: 29, employeeCount: 8, status: "Active" },
  { id: 10, name: "Finance", code: "FIN", managerId: 15, employeeCount: 4, status: "Active" },
  { id: 11, name: "Legal", code: "LEGAL", managerId: 76, employeeCount: 3, status: "Active" },
  { id: 12, name: "Operations", code: "OPS", managerId: 19, employeeCount: 5, status: "Active" },
  { id: 13, name: "Business Development", code: "BD", managerId: 95, employeeCount: 3, status: "Active" },
  { id: 14, name: "Executive", code: "EXEC", managerId: 100, employeeCount: 3, status: "Active" },
  { id: 15, name: "Administration", code: "ADMIN", managerId: 40, employeeCount: 2, status: "Active" }
];

export default departmentsData; 