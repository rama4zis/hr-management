export interface Performance {
  id: number;
  employeeId: number;
  employeeName: string;
  reviewPeriod: string;
  rating: number;
  status: 'Pending' | 'Completed' | 'Overdue';
  reviewer: string;
  reviewDate: string;
}

export const performanceData: Performance[] = [
  { id: 1, employeeId: 1, employeeName: "John Doe", reviewPeriod: "Q4 2023", rating: 4.5, status: "Completed", reviewer: "Lisa Thompson", reviewDate: "2024-01-15" },
  { id: 2, employeeId: 2, employeeName: "Sarah Johnson", reviewPeriod: "Q4 2023", rating: 4.8, status: "Completed", reviewer: "Lisa Thompson", reviewDate: "2024-01-10" },
  { id: 3, employeeId: 3, employeeName: "Michael Chen", reviewPeriod: "Q4 2023", rating: 4.2, status: "Completed", reviewer: "Lisa Thompson", reviewDate: "2024-01-12" },
  { id: 4, employeeId: 4, employeeName: "Emily Rodriguez", reviewPeriod: "Q4 2023", rating: 4.0, status: "Completed", reviewer: "Lisa Thompson", reviewDate: "2024-01-08" },
  { id: 5, employeeId: 5, employeeName: "David Wilson", reviewPeriod: "Q4 2023", rating: 4.6, status: "Completed", reviewer: "Lisa Thompson", reviewDate: "2024-01-14" },
  { id: 6, employeeId: 6, employeeName: "Lisa Thompson", reviewPeriod: "Q4 2023", rating: 4.7, status: "Completed", reviewer: "Lightning Harrison", reviewDate: "2024-01-05" },
  { id: 7, employeeId: 7, employeeName: "Robert Kim", reviewPeriod: "Q4 2023", rating: 4.3, status: "Completed", reviewer: "Lisa Thompson", reviewDate: "2024-01-11" },
  { id: 8, employeeId: 8, employeeName: "Jennifer Lee", reviewPeriod: "Q4 2023", rating: 4.1, status: "Completed", reviewer: "Lisa Thompson", reviewDate: "2024-01-09" },
  { id: 9, employeeId: 9, employeeName: "Christopher Brown", reviewPeriod: "Q4 2023", rating: 4.4, status: "Completed", reviewer: "Lisa Thompson", reviewDate: "2024-01-13" },
  { id: 10, employeeId: 10, employeeName: "Amanda Garcia", reviewPeriod: "Q4 2023", rating: 3.9, status: "Completed", reviewer: "Lisa Thompson", reviewDate: "2024-01-07" }
];

export default performanceData; 