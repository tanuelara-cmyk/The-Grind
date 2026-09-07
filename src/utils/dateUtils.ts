/**
 * Date utilities for The Grind Habit Tracker.
 * All date calculations use the native JavaScript Date API and the user's local timezone.
 */

export interface DayInfo {
  date: Date;
  key: string;         // e.g. "2026-09-05"
  dayName: string;     // e.g. "Sat"
  fullDayName: string; // e.g. "Saturday"
  monthDay: string;    // e.g. "Sep 5"
  dayOfMonth: number;  // e.g. 5
  isToday: boolean;
  isFuture: boolean;
}

/**
 * Returns a local date key in YYYY-MM-DD format.
 */
export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date object into a readable display string:
 * e.g. "Saturday, September 5, 2026"
 */
export function formatDisplayDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns an array of the last 7 days ending with the specified currentDate.
 */
export function getLast7Days(currentDate: Date = new Date()): DayInfo[] {
  const todayKey = getLocalDateKey(currentDate);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - (6 - i));
    const key = getLocalDateKey(d);
    return {
      date: d,
      key,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
      monthDay: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayOfMonth: d.getDate(),
      isToday: key === todayKey,
      isFuture: false,
    };
  });
}

/**
 * Returns the 7 days of the current calendar week (Monday through Sunday)
 * around the specified currentDate.
 */
export function getMondayToSundayWeek(currentDate: Date = new Date()): DayInfo[] {
  const d = new Date(currentDate);
  const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  // Distance from Monday (Monday = 0, Tuesday = 1, ..., Sunday = 6)
  const distanceToMon = (dayOfWeek + 6) % 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - distanceToMon);

  const todayKey = getLocalDateKey(currentDate);
  const todayMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();

  return Array.from({ length: 7 }, (_, i) => {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    const dayMidnight = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate()).getTime();
    const key = getLocalDateKey(currentDay);

    return {
      date: currentDay,
      key,
      dayName: currentDay.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDayName: currentDay.toLocaleDateString('en-US', { weekday: 'long' }),
      monthDay: currentDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayOfMonth: currentDay.getDate(),
      isToday: key === todayKey,
      isFuture: dayMidnight > todayMidnight,
    };
  });
}

/**
 * Calculates the consecutive active daily streak and total completed days for a specific habit
 * using actual historical completion records and current calendar date.
 *
 * Rules:
 * - If completed today: streak counts today + consecutive previous days backwards.
 * - If not completed today: checks yesterday. If yesterday was completed, the streak is alive
 *   and counts consecutive days backwards from yesterday (giving user time to complete today).
 * - If neither today nor yesterday was completed: streak is 0.
 */
export function calculateHabitStreak(
  habitId: number,
  completionsByDate: Record<string, number[]>,
  currentDate: Date = new Date()
): { streak: number; totalCompleted: number } {
  let totalCompleted = 0;
  for (const dateKey of Object.keys(completionsByDate)) {
    if (completionsByDate[dateKey]?.includes(habitId)) {
      totalCompleted++;
    }
  }

  const todayKey = getLocalDateKey(currentDate);
  const isCompletedToday = (completionsByDate[todayKey] || []).includes(habitId);

  let streak = 0;
  const checkDate = new Date(currentDate);

  if (isCompletedToday) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
      const key = getLocalDateKey(checkDate);
      if ((completionsByDate[key] || []).includes(habitId)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  } else {
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayKey = getLocalDateKey(checkDate);
    if ((completionsByDate[yesterdayKey] || []).includes(habitId)) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const key = getLocalDateKey(checkDate);
        if ((completionsByDate[key] || []).includes(habitId)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      streak = 0;
    }
  }

  return { streak, totalCompleted };
}

/**
 * Calculates the all-time best (longest) consecutive daily streak for a specific habit
 * across its entire historical completion records.
 */
export function calculateHabitBestStreak(
  habitId: number,
  completionsByDate: Record<string, number[]>
): number {
  const datesWithHabit = Object.keys(completionsByDate)
    .filter(dateKey => (completionsByDate[dateKey] || []).includes(habitId))
    .sort();

  if (datesWithHabit.length === 0) return 0;
  if (datesWithHabit.length === 1) return 1;

  let maxStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < datesWithHabit.length; i++) {
    const prevParts = datesWithHabit[i - 1].split('-').map(Number);
    const currParts = datesWithHabit[i].split('-').map(Number);
    // Use UTC to prevent daylight savings shifts from affecting consecutive day counts
    const prevDate = new Date(Date.UTC(prevParts[0], prevParts[1] - 1, prevParts[2]));
    const currDate = new Date(Date.UTC(currParts[0], currParts[1] - 1, currParts[2]));

    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentRun++;
      if (currentRun > maxStreak) {
        maxStreak = currentRun;
      }
    } else if (diffDays > 1) {
      currentRun = 1;
    }
  }

  return maxStreak;
}
