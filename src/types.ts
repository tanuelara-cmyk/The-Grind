export interface HabitItem {
  id: number;
  name: string;
  category: string;
  icon: string;
  target: string;
  reminderTime: string;
  completed: boolean;
  archived?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  goals: string[];
  createdAt: string;
}

export interface DailyReminderSettings {
  enabled: boolean;
  time: string; // "20:00" or "08:00 PM"
  skipIfAllCompleted: boolean;
}

export interface UserAccount {
  profile: UserProfile;
  habits: Array<Omit<HabitItem, 'completed'>>;
  completionsByDate: Record<string, number[]>; // YYYY-MM-DD -> habitId[]
  manualStreakOverride?: number;
  reminderSettings?: DailyReminderSettings;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  username: string;
  habitName: string;
  currentStreak: number;
  totalCompletedDays: number;
  isCurrentUser: boolean;
  rank: number;
}
