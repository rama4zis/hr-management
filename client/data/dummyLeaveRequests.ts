import { LeaveRequest } from '@/model/LeaveRequest';

export const dummyLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-1',
    type: 'annual',
    startDate: new Date('2025-07-15'),
    endDate: new Date('2025-07-19'),
    totalDays: 5,
    reason: 'Family vacation to Europe',
    status: 'approved',
    approvedBy: 'emp-2',
    requestDate: new Date('2025-06-01'),
    responseDate: new Date('2025-06-03'),
    comments: 'Approved. Enjoy your vacation!',
  },
  {
    id: 'leave-2',
    employeeId: 'emp-3',
    type: 'sick',
    startDate: new Date('2025-06-20'),
    endDate: new Date('2025-06-22'),
    totalDays: 3,
    reason: 'Flu and fever',
    status: 'approved',
    approvedBy: 'emp-1',
    requestDate: new Date('2025-06-19'),
    responseDate: new Date('2025-06-19'),
    comments: 'Get well soon. Medical certificate required upon return.',
  },
  {
    id: 'leave-3',
    employeeId: 'emp-6',
    type: 'personal',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-07-03'),
    totalDays: 3,
    reason: 'Moving to new apartment',
    status: 'pending',
    requestDate: new Date('2025-06-20'),
  },
  {
    id: 'leave-4',
    employeeId: 'emp-7',
    type: 'annual',
    startDate: new Date('2025-08-10'),
    endDate: new Date('2025-08-20'),
    totalDays: 11,
    reason: 'Wedding and honeymoon trip',
    status: 'approved',
    approvedBy: 'emp-1',
    requestDate: new Date('2025-06-15'),
    responseDate: new Date('2025-06-17'),
    comments: 'Congratulations! Approved for the special occasion.',
  },
  {
    id: 'leave-5',
    employeeId: 'emp-9',
    type: 'emergency',
    startDate: new Date('2025-06-24'),
    endDate: new Date('2025-06-24'),
    totalDays: 1,
    reason: 'Family emergency - hospitalization',
    status: 'approved',
    approvedBy: 'emp-3',
    requestDate: new Date('2025-06-24'),
    responseDate: new Date('2025-06-24'),
    comments: 'Emergency leave approved. Hope everything is okay.',
  },
  {
    id: 'leave-6',
    employeeId: 'emp-4',
    type: 'annual',
    startDate: new Date('2025-09-05'),
    endDate: new Date('2025-09-12'),
    totalDays: 8,
    reason: 'Annual family reunion',
    status: 'pending',
    requestDate: new Date('2025-06-22'),
  },
  {
    id: 'leave-7',
    employeeId: 'emp-8',
    type: 'sick',
    startDate: new Date('2025-06-23'),
    endDate: new Date('2025-06-25'),
    totalDays: 3,
    reason: 'Food poisoning',
    status: 'approved',
    approvedBy: 'emp-2',
    requestDate: new Date('2025-06-22'),
    responseDate: new Date('2025-06-22'),
    comments: 'Approved. Take care and rest well.',
  },
  {
    id: 'leave-8',
    employeeId: 'emp-10',
    type: 'personal',
    startDate: new Date('2025-07-28'),
    endDate: new Date('2025-07-30'),
    totalDays: 3,
    reason: 'Attending professional development conference',
    status: 'rejected',
    approvedBy: 'emp-4',
    requestDate: new Date('2025-06-18'),
    responseDate: new Date('2025-06-20'),
    comments: 'Conference conflicts with important project deadline. Please reschedule.',
  },
  {
    id: 'leave-9',
    employeeId: 'emp-5',
    type: 'maternity',
    startDate: new Date('2025-08-01'),
    endDate: new Date('2025-11-01'),
    totalDays: 92,
    reason: 'Maternity leave for newborn',
    status: 'approved',
    approvedBy: 'emp-1',
    requestDate: new Date('2025-05-15'),
    responseDate: new Date('2025-05-17'),
    comments: 'Congratulations! Maternity leave approved as per company policy.',
  },
  {
    id: 'leave-10',
    employeeId: 'emp-2',
    type: 'annual',
    startDate: new Date('2025-12-23'),
    endDate: new Date('2025-12-31'),
    totalDays: 9,
    reason: 'Christmas and New Year holidays',
    status: 'pending',
    requestDate: new Date('2025-06-23'),
  },
];
