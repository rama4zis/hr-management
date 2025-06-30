import { Position } from '@/model/Position';

export const dummyPositions: Position[] = [
  // HR Department
  {
    id: 'pos-1',
    title: 'HR Manager',
    description: 'Oversees all HR operations and employee relations',
    departmentId: 'dept-1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'pos-2',
    title: 'HR Assistant',
    description: 'Supports HR operations and administrative tasks',
    departmentId: 'dept-1',
    createdAt: new Date('2024-01-15'),
  },
  
  // IT Department
  {
    id: 'pos-3',
    title: 'IT Manager',
    description: 'Leads the IT team and manages technology infrastructure',
    departmentId: 'dept-2',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'pos-4',
    title: 'Software Developer',
    description: 'Develops and maintains software applications',
    departmentId: 'dept-2',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'pos-5',
    title: 'System Administrator',
    description: 'Manages servers, networks, and IT infrastructure',
    departmentId: 'dept-2',
    createdAt: new Date('2024-01-15'),
  },
  
  // Finance Department
  {
    id: 'pos-6',
    title: 'Finance Manager',
    description: 'Oversees financial operations and reporting',
    departmentId: 'dept-3',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'pos-7',
    title: 'Accountant',
    description: 'Handles accounting tasks and financial records',
    departmentId: 'dept-3',
    createdAt: new Date('2024-01-15'),
  },
  
  // Marketing Department
  {
    id: 'pos-8',
    title: 'Marketing Manager',
    description: 'Leads marketing strategies and campaigns',
    departmentId: 'dept-4',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'pos-9',
    title: 'Marketing Specialist',
    description: 'Executes marketing campaigns and content creation',
    departmentId: 'dept-4',
    createdAt: new Date('2024-01-20'),
  },
  
  // Operations Department
  {
    id: 'pos-10',
    title: 'Operations Manager',
    description: 'Manages daily operations and process optimization',
    departmentId: 'dept-5',
    createdAt: new Date('2024-02-01'),
  },
];
