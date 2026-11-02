export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedEmployeeId: number;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export type CreateTaskRequest = Omit<Task, 'id'>;
