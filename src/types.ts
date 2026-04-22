export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  createdAt: number;
}

export interface Completion {
  habitId: string;
  date: string; // YYYY-MM-DD
}

export interface HabitWithStatus extends Habit {
  completed: boolean;
  streak: number;
}
