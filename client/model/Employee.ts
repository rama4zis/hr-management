export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  positionId: string;
  hireDate: Date;
  salary: number;
  status: 'active' | 'inactive';
  profileImage?: string;
}

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  positionId: string;
  hireDate: Date;
  salary: number;
}
