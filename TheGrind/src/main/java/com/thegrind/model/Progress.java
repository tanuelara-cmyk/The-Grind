package com.thegrind.model;

import java.io.Serializable;
import java.util.Map;
import java.util.LinkedHashMap;

/**
 * Class: Progress
 * Aggregates statistics, weekly rates, streaks, and completion rates.
 * Demonstrates Java arrays and mappings for analytics reporting.
 */
public class Progress implements Serializable {
    private static final long serialVersionUID = 1L;

    private int userId;
    private int totalHabitsCompleted;
    private int currentStreak;
    private int bestStreak;
    private int dailyCompletionRate;
    private int weeklyCompletionRate;
    private int monthlyHabitsDone;

    // Weekly day-by-day percentages (Monday to Sunday)
    // Demonstrates Java arrays and maps
    private String[] daysOfWeek = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
    private int[] dailyPercentages = new int[7];
    private Map<String, Integer> weeklyOverviewMap;

    public Progress() {
        this.weeklyOverviewMap = new LinkedHashMap<>();
        for (int i = 0; i < daysOfWeek.length; i++) {
            weeklyOverviewMap.put(daysOfWeek[i], 0);
        }
    }

    public Progress(int userId, int totalHabitsCompleted, int currentStreak, int bestStreak,
                    int dailyCompletionRate, int weeklyCompletionRate, int monthlyHabitsDone) {
        this();
        this.userId = userId;
        this.totalHabitsCompleted = totalHabitsCompleted;
        this.currentStreak = currentStreak;
        this.bestStreak = bestStreak;
        this.dailyCompletionRate = dailyCompletionRate;
        this.weeklyCompletionRate = weeklyCompletionRate;
        this.monthlyHabitsDone = monthlyHabitsDone;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getTotalHabitsCompleted() {
        return totalHabitsCompleted;
    }

    public void setTotalHabitsCompleted(int totalHabitsCompleted) {
        this.totalHabitsCompleted = totalHabitsCompleted;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getBestStreak() {
        return bestStreak;
    }

    public void setBestStreak(int bestStreak) {
        this.bestStreak = bestStreak;
    }

    public int getDailyCompletionRate() {
        return dailyCompletionRate;
    }

    public void setDailyCompletionRate(int dailyCompletionRate) {
        this.dailyCompletionRate = dailyCompletionRate;
    }

    public int getWeeklyCompletionRate() {
        return weeklyCompletionRate;
    }

    public void setWeeklyCompletionRate(int weeklyCompletionRate) {
        this.weeklyCompletionRate = weeklyCompletionRate;
    }

    public int getMonthlyHabitsDone() {
        return monthlyHabitsDone;
    }

    public void setMonthlyHabitsDone(int monthlyHabitsDone) {
        this.monthlyHabitsDone = monthlyHabitsDone;
    }

    public String[] getDaysOfWeek() {
        return daysOfWeek;
    }

    public int[] getDailyPercentages() {
        return dailyPercentages;
    }

    public void setDailyPercentages(int[] dailyPercentages) {
        this.dailyPercentages = dailyPercentages;
        for (int i = 0; i < Math.min(daysOfWeek.length, dailyPercentages.length); i++) {
            this.weeklyOverviewMap.put(daysOfWeek[i], dailyPercentages[i]);
        }
    }

    public Map<String, Integer> getWeeklyOverviewMap() {
        return weeklyOverviewMap;
    }

    public void setWeeklyOverviewMap(Map<String, Integer> weeklyOverviewMap) {
        this.weeklyOverviewMap = weeklyOverviewMap;
    }
}
