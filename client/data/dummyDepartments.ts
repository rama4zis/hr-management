import { Department } from '@/model/Department';

export const dummyDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Human Resources',
    description: 'Manages employee relations, recruitment, and HR policies',
    managerId: 'emp-1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'dept-2',
    name: 'Information Technology',
    description: 'Handles software development, system maintenance, and tech support',
    managerId: 'emp-2',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'dept-3',
    name: 'Finance',
    description: 'Manages company finances, accounting, and budgeting',
    managerId: 'emp-3',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'dept-4',
    name: 'Marketing',
    description: 'Handles marketing campaigns, brand management, and customer outreach',
    managerId: 'emp-4',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'dept-5',
    name: 'Operations',
    description: 'Manages daily operations, logistics, and process improvement',
    managerId: 'emp-5',
    createdAt: new Date('2024-02-01'),
  },
];
