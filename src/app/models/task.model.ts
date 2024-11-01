// src/app/models/task.model.ts
export interface Task {
  id?: string;  // id is optional, can be generated by the service if not provided
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: Date;
  assignedTo?: string;  // Optional assigned user
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
