export type TaskStatus = 'todo' | 'progress' | 'done';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Member {
  id: string;
  name: string;
  initials: string;
  color: string;
  email?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  status: TaskStatus;
  due: string;
  members: string[];
  subtasks: number;
  done: number;
  priority: Priority;
}

