export interface Goal {
  id: string;
  name: string;
  totalRepeats: number;
  currentRepeats: number;
  priority: number;
  isHeldOver: boolean;
  createdAt: string;
  isNew?: boolean;
  attemptCount?: number;
  completedAt?: string;
  description?: string;
  index?: number;
  total?: number;
}

export interface Language {
  code: string;
  name: string;
  translations: Record<string, string>;
}

export type ThemeMode = 'color' | 'bw';

export interface AppState {
  goals: Goal[];
  completedGoals: Goal[];
  language: string;
  theme: ThemeMode;
}