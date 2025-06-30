export interface Position {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  createdAt: Date;
}

export interface CreatePositionData {
  title: string;
  description: string;
  departmentId: string;
}
