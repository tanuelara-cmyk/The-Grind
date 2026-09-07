import React, { useState, useMemo } from 'react';
import { 
  Archive, 
  RotateCcw, 
  Trash2, 
  Flame, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Layers
} from 'lucide-react';
import { HabitItem, UserProfile } from '../types';
import { calculateHabitStreak, calculateHabitBestStreak, getLocalDateKey } from '../utils/dateUtils';

interface HabitHistoryViewProps {
  currentUser: UserProfile;
  allHabits: Array<Omit<HabitItem, 'completed'>>;
  completionsByDate: Record<string, number[]>;
  currentDate: Date;
  onRequestArchive: (habit: Omit<HabitItem, 'completed'>) => void;
  onRestoreHabit: (habitId: number) => void;
  onRequestPermanentDelete: (habit: Omit<HabitItem, 'completed'>) => void;
  onNavigateToDashboard: () => void;
  onNavigateToCatalog: () => void;
}

export const HabitHistoryView: React.FC<HabitHistoryViewProps> = ({
  currentUser,
  allHabits,
  completionsByDate,
  currentDate,
  onRequestArchive,
  onRestoreHabit,
  onRequestPermanentDelete,
  onNavigateToDashboard,
  onNavigateToCatalog,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'archived'>('all');
  const [calendarHabitFilter, setCalendarHabitFilter] = useState<number | 'all'>('all');

  // Calendar navigation month/year state
  const [viewDate, setViewDate] = useState<Date>(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));

  const activeHabits = useMemo(() => allHabits.filter(h => !h.archived), [allHabits]);
  const archivedHabits = useMemo(() => allHabits.filter(h => !!h.archived), [allHabits]);

  const filteredHabits = useMemo(() => {
    if (filterTab === 'active') return activeHabits;
    if (filterTab === 'archived') return archivedHabits;
    return allHabits;
  }, [filterTab, activeHabits, archivedHabits, allHabits]);

  // Overall statistics
  const stats = useMemo(() => {
    // Unique completed dates that had at least one completion
    const completedDaysSet = new Set<string>();
    let totalCheckmarks = 0;

    for (const [dateKey, habitIds] of Object.entries(completionsByDate)) {
      if (Array.isArray(habitIds) && habitIds.length > 0) {
        completedDaysSet.add(dateKey);
        totalCheckmarks += habitIds.length;
      }
    }

    let overallBestStreak = 0;
    for (const h of allHabits) {
      const best = calculateHabitBestStreak(h.id, completionsByDate);
      if (best > overallBestStreak) {
        overallBestStreak = best;
      }
    }

    return {
      uniqueCompletedDays: completedDaysSet.size,
      totalCheckmarks,
      activeCount: activeHabits.length,
      archivedCount: archivedHabits.length,
      overallBestStreak,
    };
  }, [allHabits, activeHabits.length, archivedHabits.length, completionsByDate]);

  // Calendar calculations for viewDate
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // First day of month
    const firstDay = new Date(year, month, 1);
    // Day of week for 1st day (0 = Sun, 1 = Mon, ..., 6 = Sat)
    // Adjust to Monday-first (0 = Mon, ..., 6 = Sun)
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      dayNumber: number;
      dateKey: string;
      isToday: boolean;
      isCompleted: boolean;
      completedHabitIds: number[];
    }> = [];

    const todayKey = getLocalDateKey(currentDate);

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const key = getLocalDateKey(d);
      const completedIds = completionsByDate[key] || [];

      let isCompleted = false;
      if (calendarHabitFilter === 'all') {
        isCompleted = completedIds.length > 0;
      } else {
        isCompleted = completedIds.includes(calendarHabitFilter);
      }

      days.push({
        dayNumber: day,
        dateKey: key,
        isToday: key === todayKey,
        isCompleted,
        completedHabitIds: completedIds,
      });
    }

    return {
      monthName,
      firstDayOfWeek,
      days,
    };
  }, [viewDate, completionsByDate, calendarHabitFilter, currentDate]);

  const handlePrevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleCurrentMonth = () => {
    setViewDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  };

  // Helper to format date keys like "2026-09-01" to "Sept 1"
  const formatDateKey = (dateKey: string) => {
    const parts = dateKey.split('-').map(Number);
    if (parts.length !== 3) return dateKey;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Archive className="w-3.5 h-3.5" /> Habit Archive & History
          </div>
          <h1 className="text-3xl font-extrabold text-[#1A2E1F] tracking-tight">Habit History</h1>
          <p className="text-sm text-[#4F6654] mt-1">
            Complete track record of every habit you have grinded, active and archived.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToDashboard}
            className="text-xs font-bold text-[#4F6654] hover:text-[#1A2E1F] bg-white border border-[#E2EBE2] px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={onNavigateToCatalog}
            className="text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#256629] px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Habit
          </button>
        </div>
      </div>

      {/* 1. Summary Statistics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2] shadow-xs">
          <div className="flex items-center justify-between text-[#839988] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Days</span>
            <CalendarIcon className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <div className="text-3xl font-extrabold text-[#1A2E1F]">{stats.uniqueCompletedDays}</div>
          <div className="text-[11px] text-[#4F6654] mt-1">
            {stats.totalCheckmarks} total completions logged
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2] shadow-xs">
          <div className="flex items-center justify-between text-[#839988] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Habits</span>
            <Layers className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <div className="text-3xl font-extrabold text-[#2E7D32]">{stats.activeCount}</div>
          <div className="text-[11px] text-[#4F6654] mt-1">Currently tracked on dashboard</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2] shadow-xs">
          <div className="flex items-center justify-between text-[#839988] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Archived Habits</span>
            <Archive className="w-4 h-4 text-[#839988]" />
          </div>
          <div className="text-3xl font-extrabold text-[#4F6654]">{stats.archivedCount}</div>
          <div className="text-[11px] text-[#839988] mt-1">Safely preserved history</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2] shadow-xs">
          <div className="flex items-center justify-between text-[#839988] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">All-Time Best Streak</span>
            <Flame className="w-4 h-4 text-[#E65100]" />
          </div>
          <div className="text-3xl font-extrabold text-[#E65100]">
            {stats.overallBestStreak} <span className="text-sm font-bold text-[#839988]">days</span>
          </div>
          <div className="text-[11px] text-[#4F6654] mt-1">Peak consecutive consistency</div>
        </div>
      </div>

      {/* 2. Completion Calendar Visualization */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2EBE2] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2EBE2] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#1A2E1F]">{calendarData.monthName}</h3>
              <p className="text-xs text-[#839988]">Monthly consistency calendar</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter by habit */}
            <select
              value={calendarHabitFilter}
              onChange={e => setCalendarHabitFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="text-xs font-bold bg-[#F7FAF7] border border-[#E2EBE2] text-[#1A2E1F] rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="all">All Habits Combined</option>
              {allHabits.map(h => (
                <option key={h.id} value={h.id}>
                  {h.icon} {h.name} {h.archived ? '(Archived)' : ''}
                </option>
              ))}
            </select>

            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-[#E2EBE2] text-[#4F6654] hover:bg-gray-50 cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleCurrentMonth}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E2EBE2] text-[#4F6654] hover:bg-gray-50 cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-[#E2EBE2] text-[#4F6654] hover:bg-gray-50 cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-[#839988] py-1">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Leading empty offset days */}
          {Array.from({ length: calendarData.firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-12 rounded-xl bg-[#FAFBF9] opacity-40"></div>
          ))}

          {/* Days of the Month */}
          {calendarData.days.map(day => (
            <div
              key={day.dateKey}
              className={`h-12 rounded-xl border p-1.5 flex flex-col justify-between transition-all ${
                day.isCompleted
                  ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#1A2E1F]'
                  : 'bg-[#FBFDFB] border-[#E2EBE2] text-[#839988]'
              } ${day.isToday ? 'ring-2 ring-[#2E7D32]' : ''}`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={day.isToday ? 'text-[#2E7D32]' : ''}>{day.dayNumber}</span>
                {day.isCompleted && (
                  <span className="text-xs text-[#2E7D32] font-black">✓</span>
                )}
              </div>
              <div className="text-[10px] text-right font-medium">
                {day.completedHabitIds.length > 0 && calendarHabitFilter === 'all' && (
                  <span className="text-[#2E7D32] font-bold text-[9px] bg-white px-1 rounded-sm border border-[#A5D6A7]">
                    {day.completedHabitIds.length} done
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Habit History Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#1A2E1F]">All Tracked Habits</h2>
            <p className="text-xs text-[#839988]">
              Manage active habits, restore archived ones, or permanently purge archived records.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex bg-[#F0F5F0] p-1 rounded-xl border border-[#E2EBE2] self-start sm:self-auto">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterTab === 'all' ? 'bg-white text-[#1A2E1F] shadow-xs' : 'text-[#4F6654] hover:text-[#1A2E1F]'
              }`}
            >
              All ({allHabits.length})
            </button>
            <button
              onClick={() => setFilterTab('active')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterTab === 'active' ? 'bg-white text-[#2E7D32] shadow-xs' : 'text-[#4F6654] hover:text-[#1A2E1F]'
              }`}
            >
              Active ({activeHabits.length})
            </button>
            <button
              onClick={() => setFilterTab('archived')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterTab === 'archived' ? 'bg-white text-[#4F6654] shadow-xs' : 'text-[#4F6654] hover:text-[#1A2E1F]'
              }`}
            >
              Archived ({archivedHabits.length})
            </button>
          </div>
        </div>

        {/* Empty State: No habits in system at all */}
        {allHabits.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E2EBE2] text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-3xl mx-auto border border-[#A5D6A7]">
              🌱
            </div>
            <h3 className="font-extrabold text-lg text-[#1A2E1F]">No habit history yet. Start grinding today! 🔥</h3>
            <p className="text-xs text-[#4F6654] max-w-sm mx-auto">
              You haven't tracked any habits yet. Add habits to your daily stack and begin building consistency.
            </p>
            <button
              onClick={onNavigateToCatalog}
              className="bg-[#2E7D32] hover:bg-[#256629] text-white px-6 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Build Your Habit Stack
            </button>
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] text-center text-sm text-[#839988]">
            No {filterTab} habits found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHabits.map(habit => {
              const streakInfo = calculateHabitStreak(habit.id, completionsByDate, currentDate);
              const bestStreak = calculateHabitBestStreak(habit.id, completionsByDate);

              // Gather all completed dates for this habit
              const habitCompletedDates = Object.keys(completionsByDate)
                .filter(dateKey => (completionsByDate[dateKey] || []).includes(habit.id))
                .sort((a, b) => b.localeCompare(a)); // Recent first

              const isArchived = !!habit.archived;

              return (
                <div
                  key={habit.id}
                  className={`bg-white rounded-2xl border transition-all p-6 shadow-xs space-y-4 ${
                    isArchived ? 'border-[#E2EBE2] bg-[#FAFBF9]' : 'border-[#E2EBE2]'
                  }`}
                >
                  {/* Habit Card Top Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2EBE2]">
                    <div className="flex items-center gap-3.5">
                      <span className="text-3xl p-2.5 bg-[#E8F5E9] rounded-2xl">{habit.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-extrabold text-base ${isArchived ? 'text-[#4F6654]' : 'text-[#1A2E1F]'}`}>
                            {habit.name}
                          </h3>
                          {/* Active / Archived badge */}
                          {isArchived ? (
                            <span className="inline-flex items-center gap-1 bg-[#ECEFF1] text-[#546E7A] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              ⚪ Archived
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              🟢 Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#839988] mt-0.5">
                          {habit.category} &bull; Target: {habit.target} &bull; ⏰ {habit.reminderTime}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Archive, Restore, Delete Permanently */}
                    <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                      {!isArchived ? (
                        <button
                          onClick={() => onRequestArchive(habit)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F6654] hover:text-red-600 bg-[#F7FAF7] hover:bg-red-50 border border-[#E2EBE2] hover:border-red-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                          title="Archive this habit from active dashboard"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Archive</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onRestoreHabit(habit.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#DCEDC8] border border-[#A5D6A7] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                            title="Restore habit back to dashboard"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore Habit</span>
                          </button>
                          <button
                            onClick={() => onRequestPermanentDelete(habit)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                            title="Permanently delete habit and its completion history"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Permanently</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Habit Statistics Strip */}
                  <div className="grid grid-cols-3 gap-3 bg-[#F7FAF7] p-3.5 rounded-xl text-center">
                    <div>
                      <div className="text-lg font-extrabold text-[#1A2E1F]">{streakInfo.totalCompleted}</div>
                      <div className="text-[11px] font-semibold text-[#839988]">Completed Days</div>
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-[#2E7D32] flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4 text-[#2E7D32]" />
                        <span>{isArchived ? 0 : streakInfo.streak}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-[#839988]">Current Streak</div>
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-[#E65100] flex items-center justify-center gap-1">
                        <Sparkles className="w-4 h-4 text-[#E65100]" />
                        <span>{bestStreak}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-[#839988]">Best Streak</div>
                    </div>
                  </div>

                  {/* Completion History Log */}
                  <div>
                    <h4 className="text-xs font-bold text-[#4F6654] uppercase tracking-wider mb-2">
                      Completion History ({habitCompletedDates.length} recorded)
                    </h4>

                    {habitCompletedDates.length === 0 ? (
                      <div className="text-xs text-[#839988] italic bg-white p-3 rounded-xl border border-[#E2EBE2]">
                        No completions yet.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {habitCompletedDates.slice(0, 14).map(dateKey => (
                          <div
                            key={dateKey}
                            className="inline-flex items-center gap-1 text-xs font-semibold bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-2.5 py-1 rounded-lg"
                          >
                            <span>{formatDateKey(dateKey)}</span>
                            <span className="font-black">✓</span>
                          </div>
                        ))}
                        {habitCompletedDates.length > 14 && (
                          <span className="text-xs font-semibold text-[#839988] self-center">
                            +{habitCompletedDates.length - 14} more days
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
