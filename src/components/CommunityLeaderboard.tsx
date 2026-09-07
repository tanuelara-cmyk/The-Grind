import React, { useState, useMemo } from 'react';
import { Trophy, Flame, Sparkles, Plus, Award, Info } from 'lucide-react';
import { UserProfile, HabitItem } from '../types';
import { 
  getHabitLeaderboard, 
  getAllDistinctHabits, 
  normalizeHabitName 
} from '../utils/userStore';

interface CommunityLeaderboardProps {
  currentUser: UserProfile;
  userHabits: HabitItem[];
  currentDate: Date;
  onBack?: () => void;
  onAddHabitToStack?: (habitName: string, category: string, icon: string) => void;
  onNavigateToHabitCatalog?: () => void;
}

export const CommunityLeaderboard: React.FC<CommunityLeaderboardProps> = ({
  currentUser,
  userHabits = [],
  currentDate,
  onBack,
  onAddHabitToStack,
  onNavigateToHabitCatalog,
}) => {
  // All available habits tracked in the community
  const distinctHabits = useMemo(() => getAllDistinctHabits(), [userHabits]);

  // Default selected habit: user's first habit, or first available habit
  const defaultHabitName = useMemo(() => {
    if (userHabits.length > 0) {
      return userHabits[0].name;
    }
    return distinctHabits[0]?.name || 'Drink 2L Water';
  }, [userHabits, distinctHabits]);

  const [selectedHabitName, setSelectedHabitName] = useState<string>(defaultHabitName);

  // If userHabits changed and selected habit is not set, set it
  React.useEffect(() => {
    if (!selectedHabitName && userHabits.length > 0) {
      setSelectedHabitName(userHabits[0].name);
    }
  }, [userHabits, selectedHabitName]);

  // Get leaderboard for the chosen habit
  const leaderboard = useMemo(() => {
    if (!selectedHabitName) return [];
    return getHabitLeaderboard(selectedHabitName, currentUser.id, currentDate);
  }, [selectedHabitName, currentUser.id, currentDate, userHabits]);

  // Check if current user is tracking this habit
  const currentUserHabit = useMemo(() => {
    const targetNorm = normalizeHabitName(selectedHabitName);
    return userHabits.find(h => normalizeHabitName(h.name) === targetNorm);
  }, [selectedHabitName, userHabits]);

  // Current user's rank and entry
  const currentUserEntry = useMemo(() => {
    return leaderboard.find(entry => entry.isCurrentUser);
  }, [leaderboard]);

  const selectedHabitMeta = useMemo(() => {
    const targetNorm = normalizeHabitName(selectedHabitName);
    return distinctHabits.find(h => normalizeHabitName(h.name) === targetNorm) || {
      name: selectedHabitName,
      icon: currentUserHabit?.icon || '⚡',
      category: currentUserHabit?.category || 'Habit',
      userCount: leaderboard.length,
    };
  }, [selectedHabitName, distinctHabits, currentUserHabit, leaderboard.length]);

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-8">
      {/* Back to Dashboard Navigation */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F6654] hover:text-[#1A2E1F] transition-colors cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" /> Habit Consistency Leaderboard
          </div>
          <h1 className="text-3xl font-extrabold text-[#1A2E1F] tracking-tight">Community Leaderboard</h1>
          <p className="text-sm text-[#4F6654] mt-1">
            Compare daily consistency with fellow grinders tracking the exact same habit.
          </p>
        </div>

        {/* Info Pill */}
        <div className="flex items-center gap-1.5 text-xs text-[#839988] bg-white px-3 py-1.5 rounded-xl border border-[#E2EBE2] self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>Ranked strictly by active streak</span>
        </div>
      </div>

      {/* Habit Selector Dropdown & Quick Badges */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2EBE2] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold text-[#4F6654] uppercase tracking-wider">
            Select Habit to Compare
          </label>
          <span className="text-xs text-[#839988]">
            {distinctHabits.length} community habits available
          </span>
        </div>

        {/* Dropdown Selector */}
        <div className="relative">
          <select
            value={selectedHabitName}
            onChange={e => setSelectedHabitName(e.target.value)}
            className="w-full bg-[#F7FAF7] border border-[#E2EBE2] hover:border-[#2E7D32] text-[#1A2E1F] font-bold text-base rounded-xl px-4 py-3 outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition-all appearance-none cursor-pointer"
          >
            {distinctHabits.map(h => {
              const isUserTracking = userHabits.some(uh => normalizeHabitName(uh.name) === normalizeHabitName(h.name));
              return (
                <option key={h.name} value={h.name}>
                  {h.icon} {h.name} {isUserTracking ? '★ (In Your Stack)' : ''}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#4F6654]">
            ▼
          </div>
        </div>

        {/* Quick Filter Pills (User's Habits) */}
        {userHabits.length > 0 && (
          <div>
            <div className="text-[11px] font-bold text-[#839988] mb-2 uppercase tracking-wider">
              Your Habits Quick Select:
            </div>
            <div className="flex flex-wrap gap-2">
              {userHabits.map(h => {
                const isSelected = normalizeHabitName(h.name) === normalizeHabitName(selectedHabitName);
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setSelectedHabitName(h.name)}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'bg-[#F7FAF7] text-[#4F6654] border border-[#E2EBE2] hover:border-[#2E7D32] hover:text-[#2E7D32]'
                    }`}
                  >
                    <span>{h.icon}</span>
                    <span>{h.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Current User's Standings Banner (Requirement 4) */}
      {currentUserEntry ? (
        <div className="bg-[#E8F5E9] border border-[#A5D6A7] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white text-[#2E7D32] border border-[#A5D6A7] flex items-center justify-center text-xl font-black shadow-2xs">
              {currentUserEntry.rank === 1 ? '🥇' : currentUserEntry.rank === 2 ? '🥈' : currentUserEntry.rank === 3 ? '🥉' : `#${currentUserEntry.rank}`}
            </div>
            <div>
              <div className="text-base font-extrabold text-[#1A2E1F] flex items-center gap-2">
                <span>🔥 You're #{currentUserEntry.rank}</span>
                <span className="text-xs font-bold text-[#2E7D32] bg-white px-2 py-0.5 rounded-full border border-[#A5D6A7]">
                  Active Grinder
                </span>
              </div>
              <p className="text-xs text-[#4F6654] mt-0.5">
                {leaderboard.length === 1 
                  ? "You're currently leading this habit solo. Keep your streak alive!"
                  : `Ranked #${currentUserEntry.rank} among ${leaderboard.length} grinders tracking ${selectedHabitName}.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto bg-white/70 px-4 py-2 rounded-xl border border-[#A5D6A7]/50">
            <div className="text-right">
              <div className="text-xl font-black text-[#2E7D32]">{currentUserEntry.currentStreak} Days</div>
              <div className="text-[11px] text-[#839988] font-semibold">Your Streak</div>
            </div>
            <div className="h-8 w-px bg-[#A5D6A7]/60"></div>
            <div className="text-right">
              <div className="text-xl font-black text-[#1A2E1F]">{currentUserEntry.totalCompletedDays}</div>
              <div className="text-[11px] text-[#839988] font-semibold">Total Days Done</div>
            </div>
          </div>
        </div>
      ) : (
        /* Not tracking banner */
        <div className="bg-[#FFF8E1] border border-[#FFE082] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center text-xl shadow-2xs">
              ⚡
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A2E1F]">You are not tracking this habit yet</h4>
              <p className="text-xs text-[#4F6654]">
                Add "{selectedHabitName}" to your daily stack to compete on this leaderboard.
              </p>
            </div>
          </div>
          {onAddHabitToStack && (
            <button
              onClick={() => onAddHabitToStack(selectedHabitMeta.name, selectedHabitMeta.category, selectedHabitMeta.icon)}
              className="bg-[#2E7D32] hover:bg-[#256629] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-end sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add to My Stack
            </button>
          )}
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-[#E2EBE2] shadow-xs overflow-hidden">
        {/* Table Header / Subtitle */}
        <div className="p-6 border-b border-[#E2EBE2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FBFDFB]">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-[#E8F5E9] rounded-xl">{selectedHabitMeta.icon}</span>
            <div>
              <h3 className="text-lg font-extrabold text-[#1A2E1F] flex items-center gap-2">
                <span>{selectedHabitName} Leaderboard</span>
              </h3>
              <p className="text-xs text-[#839988]">
                {leaderboard.length} {leaderboard.length === 1 ? 'member' : 'members'} competing on this habit
              </p>
            </div>
          </div>
        </div>

        {/* Empty States (Requirement 7) */}
        {leaderboard.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#F7FAF7] text-[#839988] flex items-center justify-center text-3xl mx-auto border border-[#E2EBE2]">
              🌱
            </div>
            <h4 className="font-bold text-base text-[#1A2E1F]">No one is tracking this habit yet</h4>
            <p className="text-xs text-[#4F6654] max-w-sm mx-auto">
              Be the first grinder to add "{selectedHabitName}" to your daily routine and claim the #1 rank!
            </p>
            {onAddHabitToStack && (
              <button
                onClick={() => onAddHabitToStack(selectedHabitMeta.name, selectedHabitMeta.category, selectedHabitMeta.icon)}
                className="bg-[#2E7D32] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#256629] inline-flex items-center gap-1.5 mt-2"
              >
                <Plus className="w-4 h-4" /> Start Grinding This Habit
              </button>
            )}
          </div>
        ) : leaderboard.length === 1 && leaderboard[0].isCurrentUser ? (
          <div>
            {/* Solo grinding notice */}
            <div className="p-4 bg-[#F7FAF7] border-b border-[#E2EBE2] text-xs text-[#2E7D32] font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>You're the first one grinding this habit! 🔥 Keep it up to stay on top when others join.</span>
            </div>

            {/* Render single user row */}
            <div className="divide-y divide-[#E2EBE2]">
              {leaderboard.map(entry => renderLeaderboardRow(entry))}
            </div>
          </div>
        ) : (
          /* Normal Multi-user Leaderboard */
          <div className="divide-y divide-[#E2EBE2]">
            {leaderboard.map(entry => renderLeaderboardRow(entry))}
          </div>
        )}
      </div>

      {/* Leaderboard Rules & Transparency Note */}
      <div className="bg-[#F7FAF7] p-5 rounded-2xl border border-[#E2EBE2] text-xs text-[#4F6654] space-y-2">
        <div className="font-bold text-[#1A2E1F] flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#2E7D32]" />
          <span>Fair & Habit-Specific Competition</span>
        </div>
        <p className="leading-relaxed">
          The Grind Leaderboard ranks members strictly by active consecutive days for the chosen habit. 
          To protect privacy, email addresses are never displayed. If streaks are tied, total historical completions for this habit serve as the transparent tie-breaker.
        </p>
      </div>
    </div>
  );

  function renderLeaderboardRow(entry: {
    userId: string;
    displayName: string;
    username: string;
    habitName: string;
    currentStreak: number;
    totalCompletedDays: number;
    isCurrentUser: boolean;
    rank: number;
  }) {
    const isTop3 = entry.rank <= 3;
    const rankBadge = 
      entry.rank === 1 ? '🥇' :
      entry.rank === 2 ? '🥈' :
      entry.rank === 3 ? '🥉' :
      `#${entry.rank}`;

    return (
      <div
        key={entry.userId}
        className={`p-4 sm:px-6 flex items-center justify-between transition-all ${
          entry.isCurrentUser
            ? 'bg-[#E8F5E9]/60 border-l-4 border-l-[#2E7D32]'
            : 'hover:bg-[#F7FAF7]'
        }`}
      >
        {/* Left: Rank & User Info */}
        <div className="flex items-center gap-4">
          {/* Rank Badge */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
            isTop3 
              ? 'text-lg' 
              : 'text-[#839988] bg-[#F7FAF7] border border-[#E2EBE2]'
          }`}>
            {rankBadge}
          </div>

          {/* User Display Name & Handle (Strictly no email) */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full font-extrabold text-sm flex items-center justify-center shrink-0 border-2 ${
              entry.isCurrentUser
                ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                : 'bg-[#F0F5F0] text-[#2E7D32] border-[#A5D6A7]'
            }`}>
              {entry.displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#1A2E1F]">
                  {entry.displayName}
                </span>
                {entry.isCurrentUser && (
                  <span className="bg-[#2E7D32] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    You
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#839988] font-medium">
                @{entry.username}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Streak Metrics */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <Flame className={`w-4 h-4 ${entry.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className="text-base font-black text-[#1A2E1F]">
                {entry.currentStreak} {entry.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="text-[10px] text-[#839988] font-medium">
              {entry.totalCompletedDays} total {entry.totalCompletedDays === 1 ? 'completion' : 'completions'}
            </div>
          </div>
        </div>
      </div>
    );
  }
};
