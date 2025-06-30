export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string; // Employee ID of the department manager
  createdAt: Date;
}

export interface CreateDepartmentData {
  name: string;
  description: string;
  managerId?: string;
}
