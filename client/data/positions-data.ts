export interface Position {
  id: number;
  title: string;
  department: string;
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  minSalary: number;
  maxSalary: number;
  status: 'Active' | 'Inactive';
}

export const positionsData: Position[] = [
  { id: 1, title: "Senior Software Engineer", department: "Engineering", level: "Senior", minSalary: 120000, maxSalary: 180000, status: "Active" },
  { id: 2, title: "Product Manager", department: "Product", level: "Senior", minSalary: 100000, maxSalary: 150000, status: "Active" },
  { id: 3, title: "UX Designer", department: "Design", level: "Mid", minSalary: 70000, maxSalary: 100000, status: "Active" },
  { id: 4, title: "Marketing Specialist", department: "Marketing", level: "Mid", minSalary: 50000, maxSalary: 75000, status: "Active" },
  { id: 5, title: "Sales Manager", department: "Sales", level: "Senior", minSalary: 80000, maxSalary: 120000, status: "Active" },
  { id: 6, title: "HR Coordinator", department: "Human Resources", level: "Entry", minSalary: 40000, maxSalary: 60000, status: "Active" },
  { id: 7, title: "Data Analyst", department: "Analytics", level: "Mid", minSalary: 60000, maxSalary: 90000, status: "Active" },
  { id: 8, title: "Frontend Developer", department: "Engineering", level: "Mid", minSalary: 70000, maxSalary: 110000, status: "Active" },
  { id: 9, title: "Backend Developer", department: "Engineering", level: "Mid", minSalary: 75000, maxSalary: 115000, status: "Active" },
  { id: 10, title: "DevOps Engineer", department: "Engineering", level: "Senior", minSalary: 90000, maxSalary: 140000, status: "Active" },
  { id: 11, title: "Customer Success Manager", department: "Customer Success", level: "Mid", minSalary: 60000, maxSalary: 90000, status: "Active" },
  { id: 12, title: "QA Engineer", department: "Engineering", level: "Mid", minSalary: 60000, maxSalary: 90000, status: "Active" },
  { id: 13, title: "Business Analyst", department: "Product", level: "Mid", minSalary: 60000, maxSalary: 90000, status: "Active" },
  { id: 14, title: "Financial Analyst", department: "Finance", level: "Mid", minSalary: 55000, maxSalary: 85000, status: "Active" },
  { id: 15, title: "UI Designer", department: "Design", level: "Mid", minSalary: 60000, maxSalary: 90000, status: "Active" }
];

export default positionsData; 