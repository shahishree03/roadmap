export interface Peer {
  id: string;
  name: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  notes?: string;
  tags?: string[];
  createdAt: string; // ISO string
}

export type GoalType = "daily" | "short" | "mid" | "long";
export type MetricType = "hours" | "tasks" | "questions";

export interface Task {
  id: string;
  title: string;
  metricType: MetricType;
  value: number;
  completed: boolean;
  date: string; // ISO string
}

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  tasks: Task[];
  progress: number;
}

export interface AppState {
  peers: Peer[];
  goals: Goal[];

  // Peer Actions
  addPeer: (peer: Omit<Peer, 'id' | 'createdAt'>) => void;
  updatePeer: (id: string, updates: Partial<Peer>) => void;
  deletePeer: (id: string) => void;

  // Goal Actions
  addGoal: (goal: Omit<Goal, 'id' | 'tasks' | 'progress'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Task Actions
  addTask: (goalId: string, task: Omit<Task, 'id' | 'completed' | 'date'>) => void;
  updateTask: (goalId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (goalId: string, taskId: string) => void;
  toggleTask: (goalId: string, taskId: string) => void;
  resetDailyGoals: () => void;
}
