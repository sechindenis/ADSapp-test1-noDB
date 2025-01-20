import { Goal } from '../types';

export function calculateProgress(currentRepeats: number, totalRepeats: number): number {
  if (totalRepeats <= 0) return 0;
  return (currentRepeats / totalRepeats) * 100;
}

export function sortGoalsByPriority(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) => b.priority - a.priority);
}

export function filterActiveGoals(goals: Goal[]): Goal[] {
  return goals.filter(g => !g.isHeldOver);
}

export function filterHeldOverGoals(goals: Goal[]): Goal[] {
  return goals.filter(g => g.isHeldOver);
}

export function getGoalAttempts(goals: Goal[], goalName: string): number {
  return goals.filter(g => g.name === goalName).length;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}