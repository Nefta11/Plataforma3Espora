export interface Task {
  id: number;
  notes: string;
  files: File[];
  completed: boolean;
  dependencies?: number[];
  unlocked?: boolean;
}

export interface TaskState {
  [key: number]: Task;
}