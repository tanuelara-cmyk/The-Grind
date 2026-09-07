import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, CheckCircle2, Trophy, Zap, Clock, Bell, ChevronRight, 
  ArrowLeft, Plus, Trash2, Send, MessageSquare, Bot, User as UserIcon,
  Settings as SettingsIcon, BarChart3, Calendar, Sparkles,
  Pencil, Check, X, Users, Archive, History, RotateCcw
} from 'lucide-react';
import { HabitItem, UserProfile, UserAccount, DailyReminderSettings } from '../types';
import { 
  getLocalDateKey, 
  formatDisplayDate, 
  getLast7Days, 
  getMondayToSundayWeek,
  calculateHabitStreak,
  calculateHabitBestStreak
} from '../utils/dateUtils';
import {
  getActiveUserId,
  setActiveUserId,
  clearActiveUserId,
  getUserData,
  saveUserData,
  getAllUsers,
  createNewUser,
  findUserByCredential,
  DEFAULT_HABITS,
  DEFAULT_REMINDER_SETTINGS,
  EMPTY_USER_PROFILE,
  EMPTY_USER_ACCOUNT,
  normalizeHabitName
} from '../utils/userStore';
import { CommunityLeaderboard } from './CommunityLeaderboard';
import { HabitHistoryView } from './HabitHistoryView';

export const LiveSimulator: React.FC = () => {
  // Navigation Screens: 'landing' | 'login' | 'register' | 'onboarding' | 'select-habits' | 'reminders' | 'dashboard' | 'habit-details' | 'progress' | 'profile' | 'settings' | 'community' | 'history'
  // Initial user ID from localStorage
  const initialActiveUserId = getActiveUserId();
  const [activeUserId, setActiveUserIdState] = useState<string | null>(initialActiveUserId);
  const [currentScreen, setCurrentScreen] = useState<string>(() => initialActiveUserId ? 'dashboard' : 'login');
  
  // Dynamic Date State (uses JavaScript Date API and user local timezone)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [currentDateKey, setCurrentDateKey] = useState<string>(() => getLocalDateKey());

  // Auto-detect day rollover without requiring manual refresh or redeployment
  useEffect(() => {
    const checkDateTransition = () => {
      const now = new Date();
      const newKey = getLocalDateKey(now);
      if (newKey !== currentDateKey) {
        setCurrentDate(now);
        setCurrentDateKey(newKey);
      }
    };

    const intervalId = setInterval(checkDateTransition, 5000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkDateTransition();
      }
    };

    window.addEventListener('focus', checkDateTransition);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', checkDateTransition);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentDateKey]);

  // User Account Management & Isolation
  const [allRegisteredUsers, setAllRegisteredUsers] = useState<UserProfile[]>(() => getAllUsers());
  
  // Active user's isolated data
  const [userData, setUserData] = useState<UserAccount>(() => initialActiveUserId ? getUserData(initialActiveUserId) : EMPTY_USER_ACCOUNT);
  const [user, setUser] = useState<UserProfile>(() => userData.profile);
  const [rawHabits, setRawHabits] = useState<Array<Omit<HabitItem, 'completed'>>>(() => userData.habits);
  const [completionsByDate, setCompletionsByDate] = useState<Record<string, number[]>>(() => userData.completionsByDate);
  const [manualStreakOverride, setManualStreakOverride] = useState<number | undefined>(() => userData.manualStreakOverride);
  const [reminderSettings, setReminderSettings] = useState<DailyReminderSettings>(() => userData.reminderSettings || DEFAULT_REMINDER_SETTINGS);

  // Sync isolated user data whenever active user's state changes
  useEffect(() => {
    if (!activeUserId) return; // STRICT: Never save when signed out or in empty state!
    saveUserData(activeUserId, {
      profile: user,
      habits: rawHabits,
      completionsByDate,
      manualStreakOverride,
      reminderSettings,
    });
  }, [activeUserId, user, rawHabits, completionsByDate, manualStreakOverride, reminderSettings]);

  // Switch active user cleanly and replace ALL user-specific state
  const switchUser = (newUserId: string) => {
    setActiveUserId(newUserId);
    setActiveUserIdState(newUserId);
    const data = getUserData(newUserId);
    setUserData(data);
    setUser(data.profile);
    setRawHabits(data.habits || []);
    setCompletionsByDate(data.completionsByDate || {});
    setManualStreakOverride(data.manualStreakOverride);
    setReminderSettings(data.reminderSettings || DEFAULT_REMINDER_SETTINGS);
    setProfileNameInput(data.profile.name || '');
    setProfileEmailInput(data.profile.email || '');
    setIsEditingStreak(false);
    setIsEditingProfile(false);
    setSelectedHabitId(data.habits && data.habits.length > 0 ? data.habits[0].id : 1);
    setStreakMilestoneCelebration(null);
    setReminderAlert(null);
    setCustomHabitName('');
    setChatInput('');
    setChatMessages([
      { sender: 'coach', text: `Hey ${data.profile.name ? (data.profile.name.split(' ')[0] || data.profile.name) : 'there'}! I'm your Grind Coach. How can I help you stay on track today?` }
    ]);
    setAllRegisteredUsers(getAllUsers());
    setLoginError(null);
    setRegError(null);
  };

  // Streak Editing Modal & Inline State
  const [isEditingStreak, setIsEditingStreak] = useState(false);
  const [streakInputValue, setStreakInputValue] = useState<number>(7);
  const [streakToast, setStreakToast] = useState<string | null>(null);

  // Milestone Celebration Modal State
  const [streakMilestoneCelebration, setStreakMilestoneCelebration] = useState<{
    streak: number;
    habitName: string;
  } | null>(null);

  // Reminder Alert In-App Toast & Notification State
  const [reminderAlert, setReminderAlert] = useState<{
    title: string;
    message: string;
    remainingCount: number;
  } | null>(null);

  // Browser Notification Permission State
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotifPermission(perm);
        if (perm === 'granted') {
          setStreakToast('Browser notifications enabled! 🔔');
          setTimeout(() => setStreakToast(null), 3000);
        }
      } catch {
        // ignore
      }
    }
  };

  // Parse time helper (handles "08:00 PM", "8:00 PM", "20:00")
  const parseTimeString = (timeStr: string): [number, number] => {
    if (!timeStr) return [20, 0];
    const trimmed = timeStr.trim();
    const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match12) {
      let hours = parseInt(match12[1], 10);
      const minutes = parseInt(match12[2], 10);
      const meridiem = match12[3]?.toUpperCase();
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      return [hours, minutes];
    }
    return [20, 0];
  };

  // Web Audio chime for reminder alerts
  const playReminderChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Audio might be restricted until user interaction
    }
  };

  // Profile Editing State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState(user?.name || '');
  const [profileEmailInput, setProfileEmailInput] = useState(user?.email || '');

  // Auth Form State (Login & Register)
  const [loginCredential, setLoginCredential] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // Archive and Permanent Delete Confirmation Modal States
  const [archiveConfirmHabit, setArchiveConfirmHabit] = useState<Omit<HabitItem, 'completed'> | null>(null);
  const [permanentDeleteConfirmHabit, setPermanentDeleteConfirmHabit] = useState<Omit<HabitItem, 'completed'> | null>(null);

  // Active habits list dynamically mapped to currentDate's completion state (excluding archived)
  const habits: HabitItem[] = useMemo(() => {
    const completedTodayIds = completionsByDate[currentDateKey] || [];
    return rawHabits
      .filter(h => !h.archived)
      .map(h => ({
        ...h,
        completed: completedTodayIds.includes(h.id),
      }));
  }, [rawHabits, completionsByDate, currentDateKey]);

  // Calculate real consecutive streaks per active habit using actual completion records
  const habitStreaks = useMemo(() => {
    const active = rawHabits.filter(h => !h.archived);
    return active.map(h => calculateHabitStreak(h.id, completionsByDate, currentDate));
  }, [rawHabits, completionsByDate, currentDate]);

  // Dynamic user streak metrics strictly reflecting their own data
  const userCurrentStreak = useMemo(() => {
    if (manualStreakOverride !== undefined) return manualStreakOverride;
    if (rawHabits.length === 0) return 0;
    return Math.max(0, ...habitStreaks.map(s => s.streak));
  }, [manualStreakOverride, rawHabits.length, habitStreaks]);

  const userTotalCompleted = useMemo(() => {
    if (rawHabits.length === 0) return 0;
    let total = 0;
    for (const d of Object.keys(completionsByDate)) {
      total += (completionsByDate[d] || []).length;
    }
    return total;
  }, [rawHabits.length, completionsByDate]);

  // Best streak strictly calculated from user's actual historical completion records
  const userBestStreak = useMemo(() => {
    if (rawHabits.length === 0) return 0;
    const historicalBests = rawHabits.map(h => calculateHabitBestStreak(h.id, completionsByDate));
    const maxHistorical = Math.max(0, ...historicalBests);
    return Math.max(userCurrentStreak, maxHistorical);
  }, [rawHabits, completionsByDate, userCurrentStreak]);

  // Smart Reminder Trigger Logic (Strictly obeys Part 6, 7, 8, 10)
  const triggerDailyReminder = (isManualTest = false) => {
    const active = rawHabits.filter(h => !h.archived);

    // Edge case 3: User has no active habits
    if (active.length === 0) {
      if (isManualTest) {
        setStreakToast('🔕 You have no active habits in your stack. Add habits first.');
        setTimeout(() => setStreakToast(null), 3500);
      }
      return;
    }

    // Check habits for current date
    const completedTodayIds = completionsByDate[currentDateKey] || [];
    const remainingHabits = active.filter(h => !completedTodayIds.includes(h.id));
    const remainingCount = remainingHabits.length;

    // Edge case 1 & 2: All habits completed today
    if (remainingCount === 0) {
      if (reminderSettings.skipIfAllCompleted) {
        if (isManualTest) {
          setStreakToast('🔕 No notification: All habits are completed today! Great discipline. 🎉');
          setTimeout(() => setStreakToast(null), 4000);
        }
        return; // 🔕 No notification
      }
    }

    // Edge cases 4 & 5: Unfinished habits remain
    const bodyMessage = remainingCount === 1
      ? 'You still have 1 habit left today.\nKeep grinding!'
      : `You still have ${remainingCount} habits left today.\nFinish strong!`;

    // 1. In-app banner alert (guaranteed to work in iframe & preview)
    setReminderAlert({
      title: 'The Grind 🔥',
      message: bodyMessage,
      remainingCount,
    });
    playReminderChime();

    // 2. System Browser Notification (if supported & permitted)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification('The Grind 🔥', {
          body: remainingCount === 1 ? 'You still have 1 habit left today. Keep grinding!' : `You still have ${remainingCount} habits left today. Finish strong!`,
          icon: 'https://api.iconify.design/twemoji/seedling.svg',
        });
        notif.onclick = () => {
          window.focus();
          setCurrentScreen('dashboard');
        };
      } catch {
        // Handled silently
      }
    }

    if (isManualTest) {
      setStreakToast(remainingCount === 1 
        ? '🔔 Reminder fired: 1 habit left today!' 
        : `🔔 Reminder fired: ${remainingCount} habits left today!`
      );
      setTimeout(() => setStreakToast(null), 3500);
    }
  };

  // Scheduled check for daily reminder (runs while app/tab is open)
  useEffect(() => {
    if (!reminderSettings.enabled) return;

    const checkReminder = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Convert reminder time e.g. "20:00" or "08:00 PM"
      const [targetHours, targetMinutes] = parseTimeString(reminderSettings.time);

      if (currentHours === targetHours && currentMinutes === targetMinutes) {
        const todayKey = getLocalDateKey(now);
        const lastFiredKey = `the_grind_last_reminder_${activeUserId}_${todayKey}`;
        const hasFiredToday = localStorage.getItem(lastFiredKey);

        if (!hasFiredToday) {
          localStorage.setItem(lastFiredKey, 'true');
          triggerDailyReminder(false);
        }
      }
    };

    checkReminder();
    const intervalId = setInterval(checkReminder, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, [reminderSettings, activeUserId, rawHabits, completionsByDate, currentDateKey]);

  const handleOpenStreakEditor = () => {
    setStreakInputValue(userCurrentStreak);
    setIsEditingStreak(true);
  };

  const handleSaveStreak = (newVal: number) => {
    const validVal = Math.max(0, Math.floor(isNaN(newVal) ? 0 : newVal));
    setManualStreakOverride(validVal);
    setIsEditingStreak(false);
    setStreakToast(`Streak updated to ${validVal} day${validVal === 1 ? '' : 's'}! 🔥`);
    setTimeout(() => setStreakToast(null), 3000);
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);
    if (!loginCredential.trim()) {
      setLoginError('Please enter your email or username.');
      return;
    }
    const found = findUserByCredential(loginCredential);
    if (found) {
      switchUser(found.id);
      setLoginCredential('');
      setLoginPassword('');
      setStreakToast(`Welcome back, ${found.name}! 👋`);
      setTimeout(() => setStreakToast(null), 3000);
      setCurrentScreen('dashboard');
    } else {
      setLoginError('No account found with this email/username. Click "Create Account" below to register.');
    }
  };

  const handleRegisterSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setRegError(null);
    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please enter a valid email address.');
      return;
    }
    const newProfile = createNewUser(regName, regEmail, regPassword);
    setAllRegisteredUsers(getAllUsers());
    
    // Clear registration inputs
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setLoginCredential('');
    setLoginPassword('');
    
    // Switch to new user and replace all user-specific state cleanly
    switchUser(newProfile.id);
    
    setStreakToast(`Welcome to The Grind, ${newProfile.name}! 👋`);
    setTimeout(() => setStreakToast(null), 3500);
    setCurrentScreen('dashboard');
  };

  const handleSignOut = () => {
    // 1. Immediately clear the active logged-in user from localStorage
    clearActiveUserId();

    // 2. Clear active user ID React state
    setActiveUserIdState(null);

    // 3. Reset all in-memory React state associated with the previous user
    // Note: User's saved data in `the_grind_data_${userId}` is kept intact in localStorage!
    setUserData(EMPTY_USER_ACCOUNT);
    setUser(EMPTY_USER_PROFILE);
    setRawHabits([]);
    setCompletionsByDate({});
    setManualStreakOverride(undefined);
    setReminderSettings(DEFAULT_REMINDER_SETTINGS);
    setProfileNameInput('');
    setProfileEmailInput('');
    setIsEditingStreak(false);
    setIsEditingProfile(false);
    setSelectedHabitId(1);
    setStreakMilestoneCelebration(null);
    setReminderAlert(null);
    setCustomHabitName('');
    setChatInput('');
    setIsChatOpen(false);
    setChatMessages([
      { sender: 'coach', text: "Welcome to The Grind! Sign in to chat with your coach." }
    ]);

    // Reset login and registration form states
    setLoginCredential('');
    setLoginPassword('');
    setLoginError(null);
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegError(null);

    // Refresh user list for Quick Switch buttons
    setAllRegisteredUsers(getAllUsers());

    // 4. Navigate immediately to Login screen
    setCurrentScreen('login');
    setStreakToast('Signed out successfully.');
    setTimeout(() => setStreakToast(null), 2500);
  };

  const [selectedHabitId, setSelectedHabitId] = useState<number>(1);

  // New Habit Modal / Form
  const [customHabitName, setCustomHabitName] = useState('');
  const [customHabitTarget, setCustomHabitTarget] = useState('1');
  const [customHabitUnit, setCustomHabitUnit] = useState('times');

  // Grind Coach Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'coach' | 'user', text: string }>>(() => [
    { 
      sender: 'coach', 
      text: user?.name 
        ? `Hey ${user.name.split(' ')[0] || user.name}! I'm your Grind Coach. How can I help you stay on track today?` 
        : "Welcome to The Grind! Sign in to chat with your coach." 
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Calculations
  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle habit with dynamic date association
  const toggleHabit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletionsByDate(prev => {
      const currentCompleted = prev[currentDateKey] || [];
      const isCompleted = currentCompleted.includes(id);
      const updated = isCompleted
        ? currentCompleted.filter(hId => hId !== id)
        : [...currentCompleted, id];

      const newCompletions = {
        ...prev,
        [currentDateKey]: updated,
      };

      // Milestone trigger: only when habit is marked completed (○ → ✓)
      if (!isCompleted) {
        const streakInfo = calculateHabitStreak(id, newCompletions, currentDate);
        const milestones = [7, 14, 30, 50, 100];
        if (milestones.includes(streakInfo.streak)) {
          const habitObj = rawHabits.find(h => h.id === id);
          setStreakMilestoneCelebration({
            streak: streakInfo.streak,
            habitName: habitObj?.name || 'Habit',
          });
        }
      }

      return newCompletions;
    });
  };

  // Add custom habit
  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHabitName.trim()) return;
    const newHabit: Omit<HabitItem, 'completed'> = {
      id: Date.now(),
      name: customHabitName.trim(),
      category: 'Custom',
      icon: '⚡',
      target: `${customHabitTarget} ${customHabitUnit}`,
      reminderTime: '08:00 PM',
    };
    setRawHabits(prev => [...prev, newHabit]);
    setCustomHabitName('');
    setStreakToast(`Added "${newHabit.name}" to your stack! 🌱`);
    setTimeout(() => setStreakToast(null), 3000);
  };

  // Archive habit confirmation handler
  const handleConfirmArchive = () => {
    if (!archiveConfirmHabit) return;
    const habitId = archiveConfirmHabit.id;
    const habitName = archiveConfirmHabit.name;
    setRawHabits(prev => prev.map(h => h.id === habitId ? { ...h, archived: true } : h));
    setArchiveConfirmHabit(null);
    if (currentScreen === 'habit-details' && selectedHabitId === habitId) {
      setCurrentScreen('dashboard');
    }
    setStreakToast(`"${habitName}" archived. Completion history preserved! 📦`);
    setTimeout(() => setStreakToast(null), 3000);
  };

  // Restore an archived habit back to the dashboard
  const handleRestoreHabit = (habitId: number) => {
    const habit = rawHabits.find(h => h.id === habitId);
    setRawHabits(prev => prev.map(h => h.id === habitId ? { ...h, archived: false } : h));
    setStreakToast(`"${habit?.name || 'Habit'}" restored to your active dashboard! 🌿`);
    setTimeout(() => setStreakToast(null), 3000);
  };

  // Permanent delete confirmation handler (archived habits only)
  const handleConfirmPermanentDelete = () => {
    if (!permanentDeleteConfirmHabit) return;
    const habitId = permanentDeleteConfirmHabit.id;
    const habitName = permanentDeleteConfirmHabit.name;

    // 1. Remove habit from rawHabits
    setRawHabits(prev => prev.filter(h => h.id !== habitId));

    // 2. Remove ALL completion records belonging to that habit ID from completionsByDate
    setCompletionsByDate(prev => {
      const updated: Record<string, number[]> = {};
      for (const [dateKey, habitIds] of Object.entries(prev)) {
        const ids = Array.isArray(habitIds) ? habitIds : [];
        updated[dateKey] = ids.filter((id: number) => id !== habitId);
      }
      return updated;
    });

    setPermanentDeleteConfirmHabit(null);
    if (currentScreen === 'habit-details' && selectedHabitId === habitId) {
      setCurrentScreen('dashboard');
    }
    setStreakToast(`"${habitName}" and its completion history were permanently deleted.`);
    setTimeout(() => setStreakToast(null), 3000);
  };

  // Delete habit -> triggers archive confirmation modal
  const handleDeleteHabit = (id: number) => {
    const habit = rawHabits.find(h => h.id === id);
    if (habit) {
      setArchiveConfirmHabit(habit);
    }
  };

  // Dynamic 7-day window ending on currentDate for habit detail history
  const last7Days = useMemo(() => getLast7Days(currentDate), [currentDate]);

  // Dynamic Monday to Sunday calendar week for analytics
  const weekDays = useMemo(() => getMondayToSundayWeek(currentDate), [currentDate]);

  const weeklyStats = useMemo(() => {
    return weekDays.map(day => {
      if (day.isToday) {
        return {
          ...day,
          pct: completionPercentage,
        };
      }
      if (day.isFuture) {
        return {
          ...day,
          pct: 0,
        };
      }
      const dayCompletions = completionsByDate[day.key] || [];
      const pct = rawHabits.length > 0 
        ? Math.round((dayCompletions.length / rawHabits.length) * 100) 
        : 0;
      return {
        ...day,
        pct: Math.min(100, pct),
      };
    });
  }, [weekDays, completionsByDate, rawHabits.length, completionPercentage]);

  const weeklyAvg = useMemo(() => {
    const elapsedDays = weeklyStats.filter(d => !d.isFuture);
    if (elapsedDays.length === 0) return 0;
    const sum = elapsedDays.reduce((acc, curr) => acc + curr.pct, 0);
    return Math.round(sum / elapsedDays.length);
  }, [weeklyStats]);

  // Send Chat message
  const handleSendMessage = (msgText?: string) => {
    const text = (msgText || chatInput).trim();
    if (!text) return;

    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setChatInput('');

    // Rule-based Grind Coach intent detection mirroring ChatbotService.java
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "Keep showing up every day. Consistency is about showing up even when you don't feel like it!";

      if (lower.includes('missed') || lower.includes('failed') || lower.includes('forgot')) {
        reply = "That's completely fine! Missing one day doesn't erase your progress. Consistency isn't about perfection; it's about not missing twice. Take 5 minutes right now to knock out an easy win!";
      } else if (lower.includes('motivat') || lower.includes('hard') || lower.includes('lazy')) {
        reply = "Remember: Small steps. Big changes. You don't need intense motivation; you just need to start for 2 minutes. Your future self will thank you for showing up!";
      } else if (lower.includes('focus') || lower.includes('today') || lower.includes('next')) {
        const pending = habits.filter(h => !h.completed);
        if (pending.length === 0) {
          reply = `Outstanding work, ${user.name}! You've completed all your habits for today! Celebrate your discipline and prepare for tomorrow.`;
        } else {
          reply = `You have ${pending.length} habits pending: ${pending.map(p => p.name).join(', ')}. I suggest tackling "${pending[0].name}" right now!`;
        }
      } else if (lower.includes('streak') || lower.includes('doing') || lower.includes('progress')) {
        reply = `You've checked off ${completedCount} of ${totalCount} habits today (${completionPercentage}%), and you're currently riding a ${userCurrentStreak}-day active streak! Keep the flame burning! 🔥`;
      }

      setChatMessages(prev => [...prev, { sender: 'coach', text: reply }]);
    }, 400);
  };

  const selectedHabit = rawHabits.find(h => h.id === selectedHabitId) || rawHabits[0];

  // Enforce auth boundary: when not logged in, only landing, register, or login (default) are accessible
  const isPublicAuthScreen = currentScreen === 'login' || currentScreen === 'register' || currentScreen === 'landing';
  const effectiveScreen = activeUserId ? currentScreen : (isPublicAuthScreen ? currentScreen : 'login');

  return (
    <div className="min-h-screen bg-[#F7FAF7] text-[#1A2E1F] font-sans flex flex-col relative pb-16">
      
      {/* Top Application Bar */}
      <header className="bg-white border-b border-[#E2EBE2] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={() => setCurrentScreen(activeUserId ? 'dashboard' : 'login')} 
            className="flex items-center gap-2 cursor-pointer font-extrabold text-xl tracking-tight"
          >
            <span className="text-2xl">🌱</span>
            <span>THE GRIND</span>
          </div>

          {activeUserId ? (
            <>
              <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#4F6654]">
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className={`hover:text-[#2E7D32] transition-colors cursor-pointer ${effectiveScreen === 'dashboard' ? 'text-[#2E7D32]' : ''}`}
                >
                  Club
                </button>
                <button 
                  onClick={() => setCurrentScreen('select-habits')}
                  className={`hover:text-[#2E7D32] transition-colors cursor-pointer ${effectiveScreen === 'select-habits' ? 'text-[#2E7D32]' : ''}`}
                >
                  Habit Catalog
                </button>
                <button 
                  onClick={() => setCurrentScreen('progress')}
                  className={`hover:text-[#2E7D32] transition-colors cursor-pointer ${effectiveScreen === 'progress' ? 'text-[#2E7D32]' : ''}`}
                >
                  Progress
                </button>
                <button 
                  onClick={() => setCurrentScreen('community')}
                  className={`hover:text-[#2E7D32] transition-colors flex items-center gap-1.5 cursor-pointer ${effectiveScreen === 'community' ? 'text-[#2E7D32]' : ''}`}
                >
                  <Trophy className="w-4 h-4 text-[#2E7D32]" />
                  <span>Leaderboard</span>
                </button>
                <button 
                  onClick={() => setCurrentScreen('reminders')}
                  className={`hover:text-[#2E7D32] transition-colors cursor-pointer ${effectiveScreen === 'reminders' ? 'text-[#2E7D32]' : ''}`}
                >
                  Reminders
                </button>
                <button 
                  onClick={() => setCurrentScreen('history')}
                  className={`hover:text-[#2E7D32] transition-colors flex items-center gap-1.5 cursor-pointer ${effectiveScreen === 'history' ? 'text-[#2E7D32]' : ''}`}
                >
                  <History className="w-4 h-4 text-[#2E7D32]" />
                  <span>History</span>
                </button>
              </nav>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentScreen('reminders')} 
                  className="relative p-2 text-[#4F6654] hover:text-[#2E7D32] cursor-pointer"
                  title="Reminders"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button 
                  onClick={() => setCurrentScreen('profile')} 
                  className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold border-2 border-[#A5D6A7] flex items-center justify-center text-sm cursor-pointer"
                  title="Profile"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
                </button>

                <button 
                  onClick={handleSignOut}
                  className="text-xs border border-[#E2EBE2] px-3 py-1.5 rounded-full font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentScreen('login')}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  effectiveScreen === 'login' ? 'bg-[#E8F5E9] text-[#2E7D32] font-bold border border-[#A5D6A7]' : 'text-[#4F6654] hover:text-[#2E7D32]'
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setCurrentScreen('register')}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  effectiveScreen === 'register' ? 'bg-[#256629] text-white shadow-sm' : 'bg-[#2E7D32] text-white hover:bg-[#256629]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Screen Router */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">

        {/* 1. LANDING PAGE */}
        {effectiveScreen === 'landing' && (
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] px-4 py-1 rounded-full text-xs font-bold mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Built for Daily Consistency
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-[#1A2E1F]">
              Small steps.<br /><span className="text-[#2E7D32]">Big changes.</span>
            </h1>
            <p className="text-lg text-[#4F6654] mb-8 leading-relaxed">
              Welcome to The Grind – a habit challenge club to build daily discipline. Master your daily routines with streak preservation, weekly analytics, and an intelligent Grind Coach.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button 
                onClick={() => setCurrentScreen('onboarding')}
                className="bg-[#2E7D32] text-white px-8 py-3.5 rounded-full font-bold shadow-sm hover:bg-[#256629] transition-all cursor-pointer"
              >
                Start Your 30-Day Grind →
              </button>
              <button 
                onClick={() => setCurrentScreen('login')}
                className="border border-[#E2EBE2] px-6 py-3.5 rounded-full font-semibold hover:border-[#2E7D32] cursor-pointer"
              >
                Member Sign In
              </button>
            </div>
          </div>
        )}

        {/* 2. LOGIN PAGE */}
        {effectiveScreen === 'login' && (
          <div className="max-w-md mx-auto py-10">
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm">
              <div className="text-center mb-6">
                <span className="text-3xl mb-2 block">👋</span>
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-sm text-[#4F6654]">Sign in to maintain your streak.</p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4F6654] mb-1">Email or Username</label>
                  <input 
                    type="text" 
                    value={loginCredential}
                    onChange={e => setLoginCredential(e.target.value)}
                    placeholder="e.g. tanu.yadav@example.com or username"
                    className="w-full p-3 rounded-xl border border-[#E2EBE2] focus:border-[#2E7D32] outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4F6654] mb-1">Password</label>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl border border-[#E2EBE2] focus:border-[#2E7D32] outline-none text-sm"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#2E7D32] text-white py-3 rounded-full font-bold hover:bg-[#256629] transition-all cursor-pointer"
                >
                  Sign In to Dashboard →
                </button>
              </form>

              {/* Quick Switch Registered Accounts (For Testing / Evaluation) */}
              {allRegisteredUsers.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#E2EBE2]">
                  <div className="text-[11px] font-bold text-[#839988] uppercase tracking-wider mb-2 text-center">
                    Quick Switch Account (Demo / Testing)
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {allRegisteredUsers.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          switchUser(u.id);
                          setCurrentScreen('dashboard');
                        }}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-all cursor-pointer ${
                          u.id === activeUserId
                            ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]'
                            : 'bg-[#F7FAF7] text-[#4F6654] border-[#E2EBE2] hover:border-[#2E7D32]'
                        }`}
                      >
                        👤 {u.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-center text-xs text-[#4F6654] mt-6 pt-4 border-t border-[#E2EBE2]">
                New to the club? <button type="button" onClick={() => setCurrentScreen('register')} className="text-[#2E7D32] font-bold hover:underline cursor-pointer">Create Account</button>
              </p>
            </div>
          </div>
        )}

        {/* 3. REGISTER PAGE */}
        {effectiveScreen === 'register' && (
          <div className="max-w-md mx-auto py-10">
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm">
              <div className="text-center mb-6">
                <span className="text-3xl mb-2 block">🚀</span>
                <h2 className="text-2xl font-bold">Join The Grind</h2>
                <p className="text-sm text-[#4F6654]">Build daily habits that last a lifetime.</p>
              </div>

              {regError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4F6654] mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Aman Verma"
                    className="w-full p-3 rounded-xl border border-[#E2EBE2] focus:border-[#2E7D32] outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4F6654] mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="e.g. aman@example.com"
                    className="w-full p-3 rounded-xl border border-[#E2EBE2] focus:border-[#2E7D32] outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4F6654] mb-1">Password</label>
                  <input 
                    type="password" 
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl border border-[#E2EBE2] focus:border-[#2E7D32] outline-none text-sm"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#2E7D32] text-white py-3 rounded-full font-bold hover:bg-[#256629] transition-all cursor-pointer"
                >
                  Create Account & Start Grinding →
                </button>
              </form>

              <p className="text-center text-xs text-[#4F6654] mt-6 pt-4 border-t border-[#E2EBE2]">
                Already have an account? <button type="button" onClick={() => setCurrentScreen('login')} className="text-[#2E7D32] font-bold hover:underline cursor-pointer">Sign In</button>
              </p>
            </div>
          </div>
        )}

        {/* 4. ONBOARDING (GOALS) */}
        {effectiveScreen === 'onboarding' && (
          <div className="max-w-xl mx-auto py-6">
            <div className="text-center mb-8">
              <span className="text-4xl mb-2 block">🎯</span>
              <h2 className="text-3xl font-extrabold mb-2">What are your core goals?</h2>
              <p className="text-sm text-[#4F6654]">Step 1 of 3: Select all that apply. We will configure your stack accordingly.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {['Build Consistency', 'Be Healthier', 'Read More', 'Improve Fitness', 'Sleep Better', 'Reduce Screen Time'].map((goal, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center gap-3">
                  <input type="checkbox" defaultChecked={idx < 4} className="w-5 h-5 accent-[#2E7D32]" />
                  <span className="font-semibold text-sm">{goal}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentScreen('dashboard')} className="text-sm text-[#839988] font-semibold">Skip for now</button>
              <button 
                onClick={() => setCurrentScreen('select-habits')}
                className="bg-[#2E7D32] text-white px-8 py-3 rounded-full font-bold hover:bg-[#256629]"
              >
                Next: Choose Habits →
              </button>
            </div>
          </div>
        )}

        {/* 5. SELECT HABITS */}
        {effectiveScreen === 'select-habits' && (
          <div className="max-w-2xl mx-auto py-6">
            <div className="text-center mb-8">
              <span className="text-4xl mb-2 block">⚡</span>
              <h2 className="text-3xl font-extrabold mb-2">Build Your Habit Stack</h2>
              <p className="text-sm text-[#4F6654]">Select from popular consistency habits or add your own custom goals.</p>
            </div>

            {/* Current User's Stack */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-[#1A2E1F] flex items-center gap-1.5">
                  <span>Your Current Stack</span>
                  <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full font-bold">
                    {rawHabits.length} {rawHabits.length === 1 ? 'Habit' : 'Habits'}
                  </span>
                </h3>
              </div>

              {rawHabits.length === 0 ? (
                <div className="p-6 bg-white rounded-xl border border-dashed border-[#A5D6A7] text-center text-sm text-[#4F6654]">
                  You have no habits in your stack yet. Choose from the catalog below or create your own!
                </div>
              ) : (
                <div className="space-y-2">
                  {rawHabits.map(h => (
                    <div key={h.id} className="bg-white p-3.5 rounded-xl border border-[#E2EBE2] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{h.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-[#1A2E1F]">{h.name}</h4>
                          <p className="text-xs text-[#839988]">{h.category} &bull; Target: {h.target}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteHabit(h.id)}
                        className="p-1.5 text-[#839988] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove habit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Catalog Habits */}
            <div className="mb-8">
              <h3 className="font-bold text-sm text-[#1A2E1F] mb-3">Popular Habits to Add</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEFAULT_HABITS.map(catHabit => {
                  const isInStack = rawHabits.some(
                    h => normalizeHabitName(h.name) === normalizeHabitName(catHabit.name)
                  );
                  return (
                    <div key={catHabit.id} className="bg-white p-3.5 rounded-xl border border-[#E2EBE2] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{catHabit.icon}</span>
                        <div>
                          <h4 className="font-bold text-xs text-[#1A2E1F]">{catHabit.name}</h4>
                          <p className="text-[11px] text-[#839988]">{catHabit.category} &bull; {catHabit.target}</p>
                        </div>
                      </div>
                      {isInStack ? (
                        <span className="text-[11px] bg-[#E8F5E9] text-[#2E7D32] font-bold px-2 py-0.5 rounded-full">
                          ✓ In Stack
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setRawHabits(prev => [...prev, { ...catHabit, id: Date.now() + Math.random() }]);
                            setStreakToast(`Added "${catHabit.name}" to stack! 🌱`);
                            setTimeout(() => setStreakToast(null), 2500);
                          }}
                          className="text-xs bg-[#2E7D32] hover:bg-[#256629] text-white font-bold px-3 py-1 rounded-full transition-colors"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Habit Box */}
            <div className="bg-[#F0F5F0] p-6 rounded-2xl border border-dashed border-[#A5D6A7] mb-8">
              <h3 className="text-sm font-bold text-[#1A2E1F] mb-3">✨ Add Custom Habit</h3>
              <form onSubmit={handleAddCustomHabit} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Habit Name (e.g. Cold Shower, LeetCode, Piano)" 
                  value={customHabitName}
                  onChange={e => setCustomHabitName(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-lg border border-[#E2EBE2] text-sm"
                  required
                />
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={customHabitTarget}
                    onChange={e => setCustomHabitTarget(e.target.value)}
                    className="w-24 p-2 bg-white rounded-lg border border-[#E2EBE2] text-sm"
                    min="1"
                  />
                  <input 
                    type="text" 
                    value={customHabitUnit}
                    onChange={e => setCustomHabitUnit(e.target.value)}
                    placeholder="Unit (mins, pages, times)"
                    className="flex-1 p-2 bg-white rounded-lg border border-[#E2EBE2] text-sm"
                  />
                </div>
                <button type="submit" className="w-full bg-white border border-[#2E7D32] text-[#2E7D32] py-2 rounded-lg text-sm font-bold hover:bg-[#E8F5E9] cursor-pointer">
                  + Add to Stack
                </button>
              </form>
            </div>

            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentScreen('dashboard')} className="text-sm text-[#839988] font-semibold hover:text-[#1A2E1F]">
                ← Back to Dashboard
              </button>
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="bg-[#2E7D32] text-white px-8 py-3 rounded-full font-bold hover:bg-[#256629] shadow-sm transition-all"
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        )}

        {/* 6. REMINDERS */}
        {effectiveScreen === 'reminders' && (
          <div className="max-w-lg mx-auto py-8">
            <div className="bg-white p-8 rounded-3xl border border-[#E2EBE2] shadow-sm text-left">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E2EBE2]">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-2xl">
                  🔔
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1A2E1F]">Daily Check-in Reminder</h2>
                  <p className="text-xs text-[#4F6654]">Configure your daily consistency nudge.</p>
                </div>
              </div>

              {/* Main Settings Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4F6654] mb-2">
                    Remind me every day at:
                  </label>
                  <div className="relative">
                    <select
                      value={reminderSettings.time}
                      onChange={(e) => setReminderSettings(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-3.5 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-bold text-base text-[#1A2E1F] focus:border-[#2E7D32] focus:outline-hidden cursor-pointer"
                    >
                      <option value="06:00 AM">06:00 AM — Early Morning</option>
                      <option value="07:00 AM">07:00 AM — Morning Kickoff</option>
                      <option value="08:00 AM">08:00 AM — Workday Start</option>
                      <option value="12:00 PM">12:00 PM — Midday Check</option>
                      <option value="05:00 PM">05:00 PM — Evening Wrap-up</option>
                      <option value="06:00 PM">06:00 PM — Sunset Grind</option>
                      <option value="07:00 PM">07:00 PM — Prime Time</option>
                      <option value="08:00 PM">08:00 PM — Evening Routine</option>
                      <option value="09:00 PM">09:00 PM — Night Owl</option>
                      <option value="10:00 PM">10:00 PM — Before Sleep</option>
                    </select>
                  </div>
                </div>

                {/* Skip if all habits completed checkbox */}
                <label className="flex items-start gap-3 p-4 rounded-xl bg-[#F7FAF7] border border-[#E2EBE2] cursor-pointer hover:border-[#A5D6A7] transition-all">
                  <input
                    type="checkbox"
                    checked={reminderSettings.skipIfAllCompleted}
                    onChange={(e) => setReminderSettings(prev => ({ ...prev, skipIfAllCompleted: e.target.checked }))}
                    className="w-5 h-5 mt-0.5 accent-[#2E7D32] rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#1A2E1F]">Skip reminder if all habits are completed</div>
                    <div className="text-xs text-[#839988] mt-0.5">
                      If your daily habits are already 100% completed today at the scheduled time, no notification will be sent.
                    </div>
                  </div>
                </label>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeUserId) {
                        saveUserData(activeUserId, {
                          reminderSettings,
                        });
                      }
                      setStreakToast('Reminder schedule saved! ⏰');
                      setTimeout(() => setStreakToast(null), 3000);
                    }}
                    className="flex-1 bg-[#2E7D32] text-white py-3.5 rounded-xl font-bold hover:bg-[#256629] transition-colors cursor-pointer text-center text-sm shadow-xs"
                  >
                    Save Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerDailyReminder(true)}
                    className="px-5 py-3.5 rounded-xl font-bold border border-[#E2EBE2] hover:border-[#2E7D32] text-[#1A2E1F] bg-white transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5"
                    title="Simulate reminder check right now based on today's remaining habits"
                  >
                    <Bell className="w-4 h-4 text-[#2E7D32]" />
                    <span>Test Reminder Now</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E2EBE2] flex justify-between items-center">
                <button
                  onClick={() => setCurrentScreen('dashboard')}
                  className="text-xs text-[#839988] font-bold hover:text-[#1A2E1F] cursor-pointer"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. DASHBOARD (MAIN APPLICATION VIEW) */}
        {effectiveScreen === 'dashboard' && (
          <div>
            {/* Greeting & Date Header */}
            <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1A2E1F]">Good day, {user.name}! 👋</h1>
                <p className="text-sm text-[#4F6654]">
                  Today is <span className="font-semibold text-[#1A2E1F]">{formatDisplayDate(currentDate)}</span> &bull; Small steps make big changes.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => setCurrentScreen('select-habits')}
                  className="bg-[#2E7D32] text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-[#256629] shadow-xs transition-colors"
                >
                  + Add Habit
                </button>
                <button 
                  onClick={() => setCurrentScreen('history')}
                  className="bg-white border border-[#E2EBE2] px-4 py-2 rounded-full font-semibold text-xs hover:border-[#2E7D32] text-[#1A2E1F] transition-colors flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>History</span>
                </button>
                <button 
                  onClick={() => setCurrentScreen('community')}
                  className="bg-[#E8F5E9] text-[#2E7D32] px-4 py-2 rounded-full font-bold text-xs hover:bg-[#DCEDC8] transition-colors flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Leaderboard</span>
                </button>
                <button 
                  onClick={() => setCurrentScreen('progress')}
                  className="border border-[#E2EBE2] px-4 py-2 rounded-full font-semibold text-xs hover:border-[#2E7D32] transition-colors"
                >
                  📊 Full Progress
                </button>
              </div>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center justify-between group hover:border-[#2E7D32]/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#FFF3E0] text-[#E65100] flex items-center justify-center text-xl">🔥</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black">{userCurrentStreak} Days</span>
                      <button 
                        onClick={handleOpenStreakEditor}
                        className="p-1 rounded-md text-[#839988] hover:text-[#E65100] hover:bg-[#FFF3E0] transition-colors"
                        title="Edit current streak"
                        aria-label="Edit current streak"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-[#839988] font-medium">Current Streak</div>
                  </div>
                </div>
                <button
                  onClick={handleOpenStreakEditor}
                  className="hidden sm:inline-flex text-[11px] text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#DCEDC8] px-2.5 py-1 rounded-lg font-bold transition-colors"
                >
                  Edit
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-xl">✅</div>
                <div>
                  <div className="text-2xl font-black">{completedCount} / {totalCount}</div>
                  <div className="text-xs text-[#839988] font-medium">Completed Today</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center text-xl">🏆</div>
                <div>
                  <div className="text-2xl font-black">{userBestStreak} Days</div>
                  <div className="text-xs text-[#839988] font-medium">Best Streak</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#F3E5F5] text-[#8E24AA] flex items-center justify-center text-xl">⚡</div>
                <div>
                  <div className="text-2xl font-black">{userTotalCompleted}</div>
                  <div className="text-xs text-[#839988] font-medium">All-Time Habits</div>
                </div>
              </div>
            </div>

            {/* 2-Column Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (Habits List) */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-extrabold text-lg">Today's Habit Stack</h2>
                  <span className="text-xs text-[#839988]">Click checkbox to toggle completion</span>
                </div>

                {habits.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-[#A5D6A7] text-center">
                    <span className="text-4xl mb-3 block">🌱</span>
                    <h3 className="text-xl font-bold text-[#1A2E1F] mb-1">Welcome to The Grind 👋</h3>
                    <p className="text-sm text-[#4F6654] mb-6 max-w-sm mx-auto">
                      Create your first habit to start your grind.
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      <button 
                        onClick={() => setCurrentScreen('select-habits')}
                        className="bg-[#2E7D32] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#256629] shadow-sm transition-all"
                      >
                        + Create Your First Habit
                      </button>
                      <button 
                        onClick={() => setCurrentScreen('community')}
                        className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#DCEDC8] transition-all flex items-center gap-1.5"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Explore Community Leaderboard</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {habits.map(h => {
                      const hStreak = calculateHabitStreak(h.id, completionsByDate, currentDate);
                      const hBest = calculateHabitBestStreak(h.id, completionsByDate);
                      const effectiveBest = Math.max(hBest, hStreak.streak);
                      return (
                        <div 
                          key={h.id}
                          onClick={() => { setSelectedHabitId(h.id); setCurrentScreen('habit-details'); }}
                          className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                            h.completed 
                              ? 'bg-[#F0F5F0] border-[rgba(46,125,50,0.2)]' 
                              : 'bg-white border-[#E2EBE2] hover:border-[#A5D6A7]'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{h.icon}</span>
                            <div>
                              <h4 className={`font-bold text-sm ${h.completed ? 'line-through text-[#4F6654]' : 'text-[#1A2E1F]'}`}>
                                {h.name}
                              </h4>
                              <div className="text-xs text-[#839988] flex items-center gap-2 mt-0.5 flex-wrap">
                                <span>{h.category} &bull; {h.target}</span>
                                <span className="inline-flex items-center gap-0.5 text-[#2E7D32] font-bold bg-[#E8F5E9] px-2 py-0.5 rounded-md text-[11px]">
                                  🔥 {hStreak.streak}d streak
                                </span>
                                <span className="inline-flex items-center gap-0.5 text-[#E65100] font-semibold bg-[#FFF3E0] px-2 py-0.5 rounded-md text-[11px]">
                                  🏆 Best: {effectiveBest}d
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => toggleHabit(h.id, e)}
                            className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                              h.completed 
                                ? 'bg-[#2E7D32] border-[#2E7D32] text-white' 
                                : 'border-[#E2EBE2] bg-transparent text-transparent hover:border-[#2E7D32]'
                            }`}
                            title="Toggle Habit Completion"
                          >
                            ✓
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column (Progress & Philosophy) */}
              <div className="space-y-6">
                
                {/* Daily Completion Progress Box */}
                <div className="bg-white p-6 rounded-2xl border border-[#E2EBE2] shadow-sm">
                  <h3 className="font-bold text-base mb-2">Today's Consistency Rate</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-extrabold text-[#2E7D32]">{completionPercentage}%</span>
                    <span className="text-xs text-[#839988]">of targets reached</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F0F5F0] rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-[#2E7D32] rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#4F6654] leading-relaxed">
                    {completionPercentage === 100 
                      ? "🎉 Incredible! You've crushed all your habits today. Take pride in your discipline." 
                      : `Keep pushing! You only have ${totalCount - completedCount} habits left to protect your streak.`}
                  </p>
                </div>

                {/* Quote Box */}
                <div className="bg-[#E8F5E9] border border-[#A5D6A7] p-5 rounded-2xl">
                  <div className="text-xs font-bold uppercase text-[#2E7D32] tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Grind Philosophy
                  </div>
                  <p className="text-sm italic text-[#1A2E1F] mb-2">
                    "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                  </p>
                  <p className="text-xs font-bold text-[#4F6654] text-right">— Will Durant</p>
                </div>

                {/* Quick Advice Prompt for Coach */}
                <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2]">
                  <div className="flex items-center gap-3 mb-3">
                    <Bot className="w-6 h-6 text-[#2E7D32]" />
                    <div>
                      <div className="font-bold text-sm">Need a Habit Nudge?</div>
                      <div className="text-xs text-[#839988]">Grind Coach is standing by</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsChatOpen(true); handleSendMessage("What should I focus on today?"); }}
                    className="w-full bg-[#F7FAF7] border border-[#E2EBE2] text-[#2E7D32] py-2 rounded-xl text-xs font-bold hover:bg-[#E8F5E9]"
                  >
                    Ask Coach: "What should I focus on?"
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 8. HABIT DETAILS */}
        {effectiveScreen === 'habit-details' && (
          <div className="max-w-xl mx-auto py-6">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#4F6654] mb-6 hover:text-[#2E7D32]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl p-3 bg-[#E8F5E9] rounded-2xl">{selectedHabit.icon}</span>
                <div>
                  <span className="text-xs font-bold uppercase text-[#2E7D32]">{selectedHabit.category}</span>
                  <h1 className="text-2xl font-extrabold">{selectedHabit.name}</h1>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F7FAF7] p-4 rounded-xl">
                  <div className="text-lg font-bold">{selectedHabit.target}</div>
                  <div className="text-xs text-[#839988]">Daily Goal Target</div>
                </div>
                <div className="bg-[#F7FAF7] p-4 rounded-xl">
                  <div className="text-lg font-bold">{selectedHabit.reminderTime}</div>
                  <div className="text-xs text-[#839988]">Daily Scheduled Reminder</div>
                </div>
              </div>

              {/* 7-Day Visual History */}
              <div className="mb-8">
                <h4 className="font-bold text-sm mb-3">7-Day Consistency Record</h4>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {last7Days.map((dayInfo) => {
                    const isDone = (completionsByDate[dayInfo.key] || []).includes(selectedHabit.id);
                    return (
                      <div key={dayInfo.key}>
                        <div className={`text-xs mb-1 font-semibold ${dayInfo.isToday ? 'text-[#2E7D32]' : 'text-[#839988]'}`}>
                          {dayInfo.dayName}
                        </div>
                        <div className={`h-10 rounded-lg font-bold flex items-center justify-center text-sm transition-all ${
                          isDone 
                            ? 'bg-[#E8F5E9] text-[#2E7D32]' 
                            : 'bg-[#F7FAF7] text-[#839988] border border-[#E2EBE2]'
                        }`}>
                          {isDone ? '✓' : '—'}
                        </div>
                        <div className="text-[10px] text-[#839988] mt-1">{dayInfo.monthDay}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-[#E2EBE2]">
                <button 
                  onClick={() => handleDeleteHabit(selectedHabit.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete Habit
                </button>
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className="bg-[#2E7D32] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#256629] cursor-pointer"
                >
                  Done Viewing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. PROGRESS ANALYTICS */}
        {effectiveScreen === 'progress' && (
          <div className="py-6">
            <div className="mb-8">
              <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold px-3 py-1 rounded-full uppercase">Analytics</span>
              <h1 className="text-3xl font-extrabold mt-2">Consistency Overview</h1>
              <p className="text-sm text-[#4F6654]">Weekly Monday-Sunday habit completion performance.</p>
            </div>

            {/* Weekly Mon-Sun Bar Chart */}
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-lg">Weekly Performance</h3>
                  <p className="text-xs text-[#839988]">Monday to Sunday completion metrics</p>
                </div>
                <span className="bg-[#E8F5E9] text-[#2E7D32] font-bold px-3 py-1 rounded-full text-xs">
                  Weekly Avg: {weeklyAvg}%
                </span>
              </div>

              <div className="grid grid-cols-7 gap-4 items-end h-56 pb-4 border-b border-[#E2EBE2]">
                {weeklyStats.map((item) => (
                  <div key={item.key} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-bold text-[#2E7D32]">{item.pct}%</span>
                    <div 
                      className={`w-full max-w-10 rounded-t-lg transition-all ${
                        item.pct >= 80 ? 'bg-[#2E7D32]' : item.pct > 0 ? 'bg-[#A5D6A7]' : 'bg-[#E2EBE2]'
                      }`}
                      style={{ height: `${Math.max(item.pct * 1.6, 4)}px` }}
                    ></div>
                    <span className={`text-xs font-semibold ${item.isToday ? 'text-[#2E7D32] font-bold' : 'text-[#4F6654]'}`}>
                      {item.dayName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2] flex flex-col justify-between group hover:border-[#2E7D32]/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <button
                    onClick={handleOpenStreakEditor}
                    className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#DCEDC8] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit Streak
                  </button>
                </div>
                <div>
                  <div className="text-2xl font-black">{userCurrentStreak} Days</div>
                  <div className="text-xs text-[#839988]">Active Streak</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2]">
                <Trophy className="w-6 h-6 text-indigo-500 mb-2" />
                <div className="text-2xl font-black">{userBestStreak} Days</div>
                <div className="text-xs text-[#839988]">Personal Record</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2]">
                <Zap className="w-6 h-6 text-purple-500 mb-2" />
                <div className="text-2xl font-black">{userTotalCompleted}</div>
                <div className="text-xs text-[#839988]">Total Habits Checked</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2]">
                <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
                <div className="text-2xl font-black">{completionPercentage}%</div>
                <div className="text-xs text-[#839988]">Today's Success Rate</div>
              </div>
            </div>

            {/* Per-Habit Streak & Best Records Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2EBE2] shadow-sm mt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-base text-[#1A2E1F]">Habit Streaks & Records</h3>
                  <p className="text-xs text-[#839988]">Current consecutive streak vs. all-time best calculated from real completions</p>
                </div>
                <button
                  onClick={() => setCurrentScreen('history')}
                  className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" /> Full History
                </button>
              </div>

              <div className="space-y-3">
                {rawHabits.filter(h => !h.archived).map(h => {
                  const hStreak = calculateHabitStreak(h.id, completionsByDate, currentDate);
                  const hBest = calculateHabitBestStreak(h.id, completionsByDate);
                  const effectiveBest = Math.max(hBest, hStreak.streak);
                  return (
                    <div key={h.id} className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#E2EBE2] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{h.icon}</span>
                        <div>
                          <div className="font-bold text-sm text-[#1A2E1F]">{h.name}</div>
                          <div className="text-xs text-[#839988]">{h.category} &bull; {h.target}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
                            🔥 {hStreak.streak} Days
                          </div>
                          <div className="text-[10px] text-[#839988]">Current Streak</div>
                        </div>
                        <div className="text-right border-l border-[#E2EBE2] pl-4">
                          <div className="text-xs font-bold text-[#E65100] flex items-center gap-1">
                            🏆 {effectiveBest} Days
                          </div>
                          <div className="text-[10px] text-[#839988]">Best Record</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 10. PROFILE */}
        {effectiveScreen === 'profile' && (
          <div className="max-w-lg mx-auto py-6">
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-black text-2xl flex items-center justify-center border-2 border-[#A5D6A7]">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold">{user.name}</h2>
                    <p className="text-xs text-[#4F6654]">{user.email}</p>
                    <span className="inline-block mt-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Silver Grinder Member
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setProfileNameInput(user.name);
                    setProfileEmailInput(user.email);
                    setIsEditingProfile(!isEditingProfile);
                  }}
                  className="border border-[#E2EBE2] text-[#4F6654] hover:text-[#2E7D32] hover:border-[#2E7D32] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditingProfile && (
                <form 
                  onSubmit={e => {
                    e.preventDefault();
                    if (profileNameInput.trim()) {
                      setUser(prev => ({
                        ...prev,
                        name: profileNameInput.trim(),
                        email: profileEmailInput.trim() || prev.email
                      }));
                      setIsEditingProfile(false);
                      setStreakToast('Profile updated successfully!');
                      setTimeout(() => setStreakToast(null), 3000);
                    }
                  }}
                  className="bg-[#F7FAF7] p-4 rounded-xl border border-[#E2EBE2] mb-6 space-y-3"
                >
                  <h4 className="font-bold text-xs text-[#4F6654]">Edit Member Information</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-[#839988] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileNameInput}
                      onChange={e => setProfileNameInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E2EBE2] bg-white text-xs font-semibold outline-none focus:border-[#2E7D32]"
                      placeholder="e.g. Tanu Yadav"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#839988] mb-1">Email</label>
                    <input
                      type="email"
                      value={profileEmailInput}
                      onChange={e => setProfileEmailInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E2EBE2] bg-white text-xs font-semibold outline-none focus:border-[#2E7D32]"
                      placeholder="e.g. tanu.yadav@example.com"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1.5 border border-[#E2EBE2] rounded-lg text-xs font-bold text-[#839988]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#2E7D32] text-white rounded-lg text-xs font-bold hover:bg-[#256629]"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              )}

              {/* Streak Stats Card in Profile with direct edit */}
              <div className="bg-[#F7FAF7] p-4 rounded-xl border border-[#E2EBE2] mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF3E0] text-[#E65100] flex items-center justify-center text-lg">🔥</div>
                  <div>
                    <div className="text-xs text-[#839988] font-medium">Active Habit Streak</div>
                    <div className="text-xl font-black text-[#1A2E1F]">{userCurrentStreak} Days</div>
                  </div>
                </div>
                <button
                  onClick={handleOpenStreakEditor}
                  className="bg-white border border-[#E2EBE2] hover:border-[#2E7D32] text-[#2E7D32] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Pencil className="w-3 h-3" /> Edit Streak
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#E2EBE2]">
                <h4 className="font-bold text-sm">Active Focus Goals</h4>
                <div className="flex flex-wrap gap-2">
                  {user.goals.map((g, idx) => (
                    <span key={idx} className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold px-3 py-1 rounded-full">
                      🎯 {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2EBE2]">
                <button 
                  onClick={() => setCurrentScreen('settings')}
                  className="w-full bg-[#F7FAF7] border border-[#E2EBE2] py-2.5 rounded-xl font-bold text-xs hover:bg-[#E8F5E9] flex items-center justify-center gap-2"
                >
                  <SettingsIcon className="w-4 h-4" /> App Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 11. SETTINGS */}
        {effectiveScreen === 'settings' && (
          <div className="max-w-lg mx-auto py-6">
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm space-y-6">
              <h2 className="text-2xl font-extrabold">Settings</h2>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#4F6654]">Notification Preferences</h4>
                <div className="bg-[#F7FAF7] p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm">Daily Habit Reminder</div>
                    <div className="text-xs text-[#839988]">08:00 AM Every Day</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#2E7D32]" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2EBE2] space-y-3">
                <h4 className="font-bold text-sm text-[#4F6654]">Security & Session</h4>
                <div className="text-xs text-[#839988]">
                  Passwords secured via SHA-256 with user-salted hashing in MySQL.
                </div>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-red-600 border border-red-200 py-2.5 rounded-xl text-xs font-bold hover:bg-red-50 cursor-pointer"
                >
                  Sign Out of The Grind
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 12. COMMUNITY LEADERBOARD */}
        {effectiveScreen === 'community' && (
          <CommunityLeaderboard 
            currentUser={user}
            userHabits={habits}
            currentDate={currentDate}
            onBack={() => setCurrentScreen('dashboard')}
            onAddHabitToStack={(habitName, category, icon) => {
              const newHabit: Omit<HabitItem, 'completed'> = {
                id: Date.now(),
                name: habitName,
                category,
                icon,
                target: '1 Daily',
                reminderTime: '08:00 PM',
              };
              setRawHabits(prev => [...prev, newHabit]);
              setStreakToast(`Added "${habitName}" to your stack! 🌱`);
              setTimeout(() => setStreakToast(null), 2500);
            }}
            onNavigateToHabitCatalog={() => setCurrentScreen('select-habits')}
          />
        )}

        {/* 13. HABIT HISTORY & ARCHIVE */}
        {effectiveScreen === 'history' && (
          <HabitHistoryView
            currentUser={user}
            allHabits={rawHabits}
            completionsByDate={completionsByDate}
            currentDate={currentDate}
            onRequestArchive={habit => setArchiveConfirmHabit(habit)}
            onRestoreHabit={handleRestoreHabit}
            onRequestPermanentDelete={habit => setPermanentDeleteConfirmHabit(habit)}
            onNavigateToDashboard={() => setCurrentScreen('dashboard')}
            onNavigateToCatalog={() => setCurrentScreen('select-habits')}
          />
        )}

      </main>

      {/* Floating Grind Coach Chatbot Button (Logged In Only) */}
      {activeUserId && (
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#2E7D32] hover:bg-[#256629] text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-50 transition-transform hover:scale-105 cursor-pointer"
          title="Open Grind Coach"
        >
          💬
        </button>
      )}

      {/* Grind Coach Chat Drawer */}
      {activeUserId && isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[520px] bg-white rounded-2xl border border-[#E2EBE2] shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#2E7D32] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm">Grind Coach</h3>
                <p className="text-[11px] opacity-85">Habit Consistency Companion</p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:opacity-75 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'coach' 
                    ? 'bg-[#E8F5E9] text-[#1A2E1F] self-start rounded-bl-none' 
                    : 'bg-[#2E7D32] text-white self-end ml-auto rounded-br-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Suggestion Chips */}
          <div className="p-2 bg-[#F7FAF7] border-t border-[#E2EBE2] flex flex-wrap gap-1.5">
            {[
              "What should I focus on today?",
              "I missed my habit today",
              "Give me some motivation",
              "How is my streak?"
            ].map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] bg-white border border-[#E2EBE2] px-2.5 py-1 rounded-full text-[#4F6654] hover:border-[#2E7D32] hover:text-[#2E7D32]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#E2EBE2] flex gap-2">
            <input 
              type="text" 
              placeholder="Ask Grind Coach..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-2 text-xs border border-[#E2EBE2] rounded-xl outline-none focus:border-[#2E7D32]"
            />
            <button 
              onClick={() => handleSendMessage()}
              className="bg-[#2E7D32] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#256629]"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {streakToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1A2E1F] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#2E7D32] flex items-center gap-2 text-xs font-semibold">
          <span>🔥</span>
          <span>{streakToast}</span>
        </div>
      )}

      {/* Streak Editor Modal */}
      {isEditingStreak && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E2EBE2] text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE2] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E0] text-[#E65100] flex items-center justify-center text-base font-black">
                  🔥
                </div>
                <h3 className="font-extrabold text-base text-[#1A2E1F]">Edit Current Streak</h3>
              </div>
              <button 
                onClick={() => setIsEditingStreak(false)}
                className="text-[#839988] hover:text-[#1A2E1F] p-1 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#4F6654] leading-relaxed mb-4">
              Update your active daily streak count. Personal best streak will automatically sync if your current streak exceeds it!
            </p>

            {/* Stepper with number input */}
            <div className="flex items-center justify-center gap-3 my-5">
              <button
                type="button"
                onClick={() => setStreakInputValue(prev => Math.max(0, prev - 1))}
                className="w-12 h-12 rounded-2xl bg-[#F7FAF7] border border-[#E2EBE2] text-xl font-black hover:bg-[#E8F5E9] text-[#2E7D32] transition-colors"
                title="Decrease by 1"
              >
                -
              </button>
              <div className="text-center">
                <input
                  type="number"
                  min="0"
                  value={streakInputValue}
                  onChange={e => setStreakInputValue(parseInt(e.target.value) || 0)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveStreak(streakInputValue);
                    }
                  }}
                  className="w-28 text-center text-3xl font-black text-[#1A2E1F] border border-[#E2EBE2] rounded-2xl py-2 focus:border-[#2E7D32] outline-none"
                  autoFocus
                />
                <div className="text-[11px] text-[#839988] mt-1 font-medium">Days active</div>
              </div>
              <button
                type="button"
                onClick={() => setStreakInputValue(prev => prev + 1)}
                className="w-12 h-12 rounded-2xl bg-[#F7FAF7] border border-[#E2EBE2] text-xl font-black hover:bg-[#E8F5E9] text-[#2E7D32] transition-colors"
                title="Increase by 1"
              >
                +
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mb-6">
              <div className="text-[11px] font-bold text-[#839988] mb-2 uppercase tracking-wider">Quick Presets</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStreakInputValue(prev => prev + 1)}
                  className="text-xs py-2 px-2 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-semibold hover:bg-[#E8F5E9] text-[#4F6654]"
                >
                  +1 Day
                </button>
                <button
                  type="button"
                  onClick={() => setStreakInputValue(7)}
                  className="text-xs py-2 px-2 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-semibold hover:bg-[#E8F5E9] text-[#4F6654]"
                >
                  7 Days (1 Wk)
                </button>
                <button
                  type="button"
                  onClick={() => setStreakInputValue(14)}
                  className="text-xs py-2 px-2 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-semibold hover:bg-[#E8F5E9] text-[#4F6654]"
                >
                  14 Days
                </button>
                <button
                  type="button"
                  onClick={() => setStreakInputValue(21)}
                  className="text-xs py-2 px-2 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-semibold hover:bg-[#E8F5E9] text-[#4F6654]"
                >
                  21 Days
                </button>
                <button
                  type="button"
                  onClick={() => setStreakInputValue(30)}
                  className="text-xs py-2 px-2 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-semibold hover:bg-[#E8F5E9] text-[#4F6654]"
                >
                  30 Days
                </button>
                <button
                  type="button"
                  onClick={() => setStreakInputValue(0)}
                  className="text-xs py-2 px-2 bg-[#FFF3E0] border border-[#FFE0B2] text-[#E65100] rounded-xl font-semibold hover:bg-[#FFE0B2]"
                >
                  Reset (0)
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditingStreak(false)}
                className="w-1/2 py-2.5 border border-[#E2EBE2] rounded-xl font-bold text-xs text-[#4F6654] hover:bg-[#F7FAF7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveStreak(streakInputValue)}
                className="w-1/2 py-2.5 bg-[#2E7D32] text-white rounded-xl font-bold text-xs hover:bg-[#256629] flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" /> Save Streak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {archiveConfirmHabit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E2EBE2] text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE2] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-base font-black">
                  <Archive className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-[#1A2E1F]">Archive this habit?</h3>
              </div>
              <button 
                onClick={() => setArchiveConfirmHabit(null)}
                className="text-[#839988] hover:text-[#1A2E1F] p-1 rounded-lg cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#4F6654] leading-relaxed mb-6">
              This habit will be removed from your active dashboard, but your completion history will be preserved.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setArchiveConfirmHabit(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E2EBE2] text-xs font-bold text-[#4F6654] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmArchive}
                className="flex-1 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Archive Habit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {permanentDeleteConfirmHabit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E2EBE2] text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE2] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-base font-black">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-red-600">Delete permanently?</h3>
              </div>
              <button 
                onClick={() => setPermanentDeleteConfirmHabit(null)}
                className="text-[#839988] hover:text-[#1A2E1F] p-1 rounded-lg cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#4F6654] leading-relaxed mb-6">
              This will permanently delete this habit and ALL of its completion history. This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPermanentDeleteConfirmHabit(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E2EBE2] text-xs font-bold text-[#4F6654] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPermanentDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Streak Milestone Celebration Modal */}
      {streakMilestoneCelebration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#A5D6A7] text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF3E0] text-[#E65100] flex items-center justify-center text-3xl mx-auto mb-3 border-2 border-[#FFE0B2]">
              🔥
            </div>
            <span className="text-[10px] font-black tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full uppercase">
              Milestone Reached!
            </span>
            <h3 className="text-2xl font-black text-[#1A2E1F] mt-2 mb-1">
              {streakMilestoneCelebration.streak}-Day Streak!
            </h3>
            <p className="text-xs font-semibold text-[#2E7D32] mb-3">
              {streakMilestoneCelebration.habitName}
            </p>
            <p className="text-xs text-[#4F6654] leading-relaxed mb-6">
              Incredible dedication! You completed this habit {streakMilestoneCelebration.streak} consecutive days in a row. Small daily steps lead to massive life changes.
            </p>
            <button
              type="button"
              onClick={() => setStreakMilestoneCelebration(null)}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Keep Grinding! 🚀
            </button>
          </div>
        </div>
      )}

      {/* In-App Reminder Alert Banner / Modal */}
      {reminderAlert && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-[#1A2E1F] text-white rounded-2xl p-4 shadow-2xl border border-[#2E7D32] z-50 flex items-start justify-between gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-xl shrink-0">
              🔔
            </div>
            <div>
              <div className="font-extrabold text-sm flex items-center gap-2">
                <span>{reminderAlert.title}</span>
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {reminderAlert.remainingCount} left
                </span>
              </div>
              <p className="text-xs text-white/80 mt-1 whitespace-pre-line leading-relaxed">
                {reminderAlert.message}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setReminderAlert(null);
                    setCurrentScreen('dashboard');
                  }}
                  className="text-xs bg-[#2E7D32] hover:bg-[#256629] text-white px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Go to Today's Habits →
                </button>
                <button
                  type="button"
                  onClick={() => setReminderAlert(null)}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReminderAlert(null)}
            className="text-white/60 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Logged In Only) */}
      {activeUserId && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2EBE2] py-2 px-1 z-40 flex justify-around items-center">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-1 ${
              effectiveScreen === 'dashboard' ? 'text-[#2E7D32]' : 'text-[#839988]'
            }`}
          >
            <span className="text-sm">🌱</span>
            <span>Club</span>
          </button>
          <button
            onClick={() => setCurrentScreen('select-habits')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-1 ${
              effectiveScreen === 'select-habits' ? 'text-[#2E7D32]' : 'text-[#839988]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>
          <button
            onClick={() => setCurrentScreen('progress')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-1 ${
              effectiveScreen === 'progress' ? 'text-[#2E7D32]' : 'text-[#839988]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Progress</span>
          </button>
          <button
            onClick={() => setCurrentScreen('community')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-1 ${
              effectiveScreen === 'community' ? 'text-[#2E7D32]' : 'text-[#839988]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
          <button
            onClick={() => setCurrentScreen('reminders')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-1 ${
              effectiveScreen === 'reminders' ? 'text-[#2E7D32]' : 'text-[#839988]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts</span>
          </button>
          <button
            onClick={() => setCurrentScreen('history')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-1 ${
              effectiveScreen === 'history' ? 'text-[#2E7D32]' : 'text-[#839988]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </nav>
      )}

    </div>
  );
};
