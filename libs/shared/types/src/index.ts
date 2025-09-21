export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: Date;
  subTasks: Task[];
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
}

export interface TestUser extends User {
  password: string;
}

export interface UserDB {
  id: string;
  email: string;
  name: string;
  hashPassword: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
