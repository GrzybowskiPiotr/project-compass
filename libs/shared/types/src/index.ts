export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: Date;
  subTasks: Task[];
}

export interface Project {
  id: string;
  userId?: string;
  name: string;
  createdAt: Date;
  tasks: Task[];
}
