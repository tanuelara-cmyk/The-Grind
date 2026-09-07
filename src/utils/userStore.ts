import { HabitItem, UserProfile, UserAccount, LeaderboardEntry, DailyReminderSettings } from '../types';
import { calculateHabitStreak, getLocalDateKey } from './dateUtils';

const USERS_LIST_KEY = 'the_grind_users_list';
const ACTIVE_USER_ID_KEY = 'the_grind_active_user_id';

export const DEFAULT_REMINDER_SETTINGS: DailyReminderSettings = {
  enabled: true,
  time: '20:00', // 8:00 PM
  skipIfAllCompleted: true,
};

// Default initial habits for the demo/existing user Tanu Yadav
export const DEFAULT_HABITS: Omit<HabitItem, 'completed'>[] = [
  { id: 1, name: 'Drink 2L Water', category: 'Health', icon: '💧', target: '2000 ml', reminderTime: '08:00 AM' },
  { id: 2, name: '30-min Workout', category: 'Fitness', icon: '🏋️', target: '30 mins', reminderTime: '06:30 AM' },
  { id: 3, name: 'Read 10 Pages', category: 'Mindset', icon: '📖', target: '10 pages', reminderTime: '09:00 PM' },
  { id: 4, name: 'Meditate 10 Mins', category: 'Mindfulness', icon: '🧘', target: '10 mins', reminderTime: '07:00 AM' },
  { id: 5, name: 'Walk 8,000 Steps', category: 'Fitness', icon: '🚶', target: '8000 steps', reminderTime: '07:30 PM' },
  { id: 6, name: 'Sleep Before 11 PM', category: 'Recovery', icon: '🌙', target: '1 time', reminderTime: '10:30 PM' },
  { id: 7, name: 'Study DSA (1 Hour)', category: 'Career', icon: '💻', target: '60 mins', reminderTime: '04:00 PM' },
];

/**
 * Initializes and retrieves all user accounts.
 * Migrates existing single-user data to the multi-user architecture cleanly.
 */
export function getAllUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // Seed or migrate Tanu Yadav as existing account
  const tanuProfile: UserProfile = {
    id: 'tanu_yadav',
    name: 'Tanu Yadav',
    username: 'tanuyadav',
    email: 'tanu.yadav@example.com',
    goals: ['Build Consistency', 'Read More', 'Improve Fitness', 'Be Healthier'],
    createdAt: '2025-01-01T00:00:00.000Z',
  };

  // Migrate legacy data if present
  let legacyHabits = DEFAULT_HABITS;
  try {
    const savedHabits = localStorage.getItem('the_grind_habits');
    if (savedHabits) {
      const parsedH = JSON.parse(savedHabits);
      if (Array.isArray(parsedH) && parsedH.length > 0) {
        legacyHabits = parsedH;
      }
    }
  } catch {
    // ignore
  }

  let legacyCompletions: Record<string, number[]> = {};
  try {
    const savedComp = localStorage.getItem('the_grind_completions');
    if (savedComp) {
      const parsedC = JSON.parse(savedComp);
      if (typeof parsedC === 'object' && parsedC !== null) {
        legacyCompletions = parsedC;
      }
    }
  } catch {
    // ignore
  }

  // If completions were empty, seed Tanu's initial 7-day demo history
  if (Object.keys(legacyCompletions).length === 0) {
    const today = getLocalDateKey();
    legacyCompletions[today] = [1, 2, 3, 4, 5];
    for (let i = 1; i <= 6; i++) {
      const pastD = new Date();
      pastD.setDate(pastD.getDate() - i);
      legacyCompletions[getLocalDateKey(pastD)] = i % 2 === 0 ? [1, 2, 3, 4, 5, 7] : [1, 2, 3, 4, 5];
    }
  }

  const initialUsers = [tanuProfile];
  saveUsersList(initialUsers);
  saveUserData(tanuProfile.id, {
    profile: tanuProfile,
    habits: legacyHabits,
    completionsByDate: legacyCompletions,
  });

  return initialUsers;
}

export const EMPTY_USER_PROFILE: UserProfile = {
  id: '',
  name: '',
  username: '',
  email: '',
  goals: [],
  createdAt: '',
};

export const EMPTY_USER_ACCOUNT: UserAccount = {
  profile: EMPTY_USER_PROFILE,
  habits: [],
  completionsByDate: {},
  manualStreakOverride: undefined,
  reminderSettings: DEFAULT_REMINDER_SETTINGS,
};

export function saveUsersList(users: UserProfile[]): void {
  try {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function getActiveUserId(): string | null {
  try {
    const savedId = localStorage.getItem(ACTIVE_USER_ID_KEY);
    if (savedId && savedId.trim() !== '') {
      const users = getAllUsers();
      if (users.some(u => u.id === savedId)) {
        return savedId;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function setActiveUserId(id: string): void {
  try {
    if (!id || id.trim() === '') {
      localStorage.removeItem(ACTIVE_USER_ID_KEY);
    } else {
      localStorage.setItem(ACTIVE_USER_ID_KEY, id);
    }
  } catch {
    // ignore
  }
}

export function clearActiveUserId(): void {
  try {
    localStorage.removeItem(ACTIVE_USER_ID_KEY);
  } catch {
    // ignore
  }
}

/**
 * Loads a user's isolated data (habits, completions, profile).
 */
export function getUserData(userId: string): UserAccount {
  if (!userId || userId.trim() === '') {
    return {
      ...EMPTY_USER_ACCOUNT,
      profile: { ...EMPTY_USER_PROFILE },
    };
  }

  const users = getAllUsers();
  const profile = users.find(u => u.id === userId) || {
    id: userId,
    name: 'New Grinder',
    username: 'grinder',
    email: 'member@thegrind.club',
    goals: [],
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(`the_grind_data_${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        profile,
        habits: Array.isArray(parsed.habits) ? parsed.habits : [],
        completionsByDate: typeof parsed.completionsByDate === 'object' && parsed.completionsByDate !== null ? parsed.completionsByDate : {},
        manualStreakOverride: parsed.manualStreakOverride,
        reminderSettings: parsed.reminderSettings || DEFAULT_REMINDER_SETTINGS,
      };
    }
  } catch {
    // ignore
  }

  // If user is Tanu Yadav and not saved yet, give her legacy data
  if (userId === 'tanu_yadav') {
    return {
      profile,
      habits: DEFAULT_HABITS,
      completionsByDate: {},
      reminderSettings: DEFAULT_REMINDER_SETTINGS,
    };
  }

  // For any other new user: STRICTLY EMPTY (No default habits, no history!)
  return {
    profile,
    habits: [],
    completionsByDate: {},
    reminderSettings: DEFAULT_REMINDER_SETTINGS,
  };
}

/**
 * Saves a user's isolated data.
 */
export function saveUserData(userId: string, data: Partial<UserAccount>): void {
  if (!userId || userId.trim() === '') return;
  try {
    const current = getUserData(userId);
    const updated: UserAccount = {
      ...current,
      ...data,
      profile: data.profile || current.profile,
    };
    localStorage.setItem(`the_grind_data_${userId}`, JSON.stringify(updated));

    // Also update users list if profile changed
    if (data.profile && data.profile.id) {
      const allUsers = getAllUsers();
      const idx = allUsers.findIndex(u => u.id === userId);
      if (idx >= 0) {
        allUsers[idx] = data.profile;
      } else {
        allUsers.push(data.profile);
      }
      saveUsersList(allUsers);
    }
  } catch {
    // ignore
  }
}

/**
 * Creates a brand new user account with completely isolated, clean data.
 * Zero default habits, zero completion history, zero streaks.
 */
export function createNewUser(name: string, email: string, password?: string): UserProfile {
  const allUsers = getAllUsers();
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  
  // Generate a clean username: e.g. "aman_sharma" or "aman"
  let baseUsername = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!baseUsername) baseUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, '') || 'grinder';
  
  // Ensure username uniqueness
  let username = baseUsername;
  let counter = 1;
  while (allUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    username = `${baseUsername}${counter++}`;
  }

  const newProfile: UserProfile = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    username,
    email: cleanEmail,
    password: password || 'secret123',
    goals: [],
    createdAt: new Date().toISOString(),
  };

  allUsers.push(newProfile);
  saveUsersList(allUsers);

  // Initialize clean isolated data with EMPTY habits and EMPTY completions
  saveUserData(newProfile.id, {
    profile: newProfile,
    habits: [], // STRICT: No default/sample habits for new users!
    completionsByDate: {}, // STRICT: No pre-existing history!
    manualStreakOverride: undefined,
    reminderSettings: DEFAULT_REMINDER_SETTINGS,
  });

  setActiveUserId(newProfile.id);
  return newProfile;
}

/**
 * Finds user by email or username or full name.
 */
export function findUserByCredential(credential: string): UserProfile | undefined {
  const norm = credential.trim().toLowerCase();
  if (!norm) return undefined;
  const users = getAllUsers();
  return users.find(u => 
    u.email.toLowerCase() === norm || 
    u.username.toLowerCase() === norm ||
    u.name.toLowerCase() === norm ||
    (norm === 'demo@thegrind.club' && u.id === 'tanu_yadav')
  );
}

/**
 * Habit normalization helper so "Study DSA" and "Study DSA (1 Hour)" or
 * differences in case/whitespace can group appropriately.
 */
export function normalizeHabitName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parenthesized details like (1 Hour), (10 Mins)
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Retrieves all distinct habit names currently tracked across all users in the system.
 */
export function getAllDistinctHabits(): Array<{ name: string; icon: string; category: string; userCount: number }> {
  const users = getAllUsers();
  const habitMap = new Map<string, { originalName: string; icon: string; category: string; userCount: number }>();

  // Add default catalog suggestions as available baseline habits
  for (const h of DEFAULT_HABITS) {
    const norm = normalizeHabitName(h.name);
    if (!habitMap.has(norm)) {
      habitMap.set(norm, {
        originalName: h.name,
        icon: h.icon,
        category: h.category,
        userCount: 0,
      });
    }
  }

  // Count active users tracking each habit
  for (const user of users) {
    const data = getUserData(user.id);
    const trackedNorms = new Set<string>();

    for (const habit of data.habits) {
      if (habit.archived) continue;
      const norm = normalizeHabitName(habit.name);
      if (!trackedNorms.has(norm)) {
        trackedNorms.add(norm);
        if (habitMap.has(norm)) {
          const entry = habitMap.get(norm)!;
          entry.userCount++;
        } else {
          habitMap.set(norm, {
            originalName: habit.name,
            icon: habit.icon,
            category: habit.category,
            userCount: 1,
          });
        }
      }
    }
  }

  return Array.from(habitMap.values()).map(item => ({
    name: item.originalName,
    icon: item.icon,
    category: item.category,
    userCount: item.userCount,
  }));
}

/**
 * Generates the habit-specific streak leaderboard for a given habit name.
 * ONLY users tracking this exact habit are included.
 * Ranked ONLY by current streak (with total completed days as tie-breaker).
 * Absolutely NO fake users.
 */
export function getHabitLeaderboard(
  habitName: string,
  currentUserId: string,
  currentDate: Date = new Date()
): LeaderboardEntry[] {
  const targetNorm = normalizeHabitName(habitName);
  const users = getAllUsers();
  const entries: Omit<LeaderboardEntry, 'rank'>[] = [];

  // [DEBUG LOGS]
  console.log('[getHabitLeaderboard] 1. currentUserId:', currentUserId);
  console.log('[getHabitLeaderboard] 2. habitName:', habitName);
  console.log('[getHabitLeaderboard] 3. targetNorm:', targetNorm);
  console.log('[getHabitLeaderboard] 4. users:', users);

  for (const user of users) {
    const userData = getUserData(user.id);
    
    // Find matching active habit for this user
    const matchingHabit = userData.habits.find(
      h => !h.archived && normalizeHabitName(h.name) === targetNorm
    );

    console.log(`[getHabitLeaderboard] 5. User [${user.id}]:`, {
      userId: user.id,
      habits: userData.habits,
      matchingHabit,
      completionsByDate: userData.completionsByDate,
    });

    if (matchingHabit) {
      // Calculate real current streak and total completed days from completion history
      const { streak, totalCompleted } = calculateHabitStreak(
        matchingHabit.id,
        userData.completionsByDate,
        currentDate
      );

      entries.push({
        userId: user.id,
        displayName: user.name,
        username: user.username,
        habitName: matchingHabit.name,
        currentStreak: streak,
        totalCompletedDays: totalCompleted,
        isCurrentUser: user.id === currentUserId,
      });
    }
  }

  console.log('[getHabitLeaderboard] 6. entries immediately before sorting:', entries);

  // Sorting:
  // 1. Current streak descending
  // 2. Total completed days descending (tie-breaker)
  // 3. Alphabetical by name
  entries.sort((a, b) => {
    if (b.currentStreak !== a.currentStreak) {
      return b.currentStreak - a.currentStreak;
    }
    if (b.totalCompletedDays !== a.totalCompletedDays) {
      return b.totalCompletedDays - a.totalCompletedDays;
    }
    return a.displayName.localeCompare(b.displayName);
  });

  // Assign ranks
  const finalLeaderboard = entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  console.log('[getHabitLeaderboard] 7. final returned leaderboard:', finalLeaderboard);

  return finalLeaderboard;
}
