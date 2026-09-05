package com.thegrind.model;

import com.thegrind.interfaces.Trackable;
import java.io.Serializable;

/**
 * Class: Habit
 * Demonstrates:
 * - Encapsulation (private fields, accessors, and mutators)
 * - Constructor Overloading (default, partial, full)
 * - Method Overloading (updateProgress with 1 and 2 parameters)
 * - Implementation of Trackable interface
 */
public class Habit implements Trackable, Serializable {
    private static final long serialVersionUID = 1L;

    // Private fields (Encapsulation)
    private int userHabitId;
    private int userId;
    private int habitId;
    private String habitName;
    private String description;
    private int targetValue;
    private String unit;
    private String frequency;
    private String icon;
    private String category;
    private String reminderTime;
    private boolean active;

    // Daily progress tracking fields
    private int todayProgress;
    private boolean completedToday;
    private int streakCount;

    // Default Constructor
    public Habit() {
        this.targetValue = 1;
        this.unit = "times";
        this.frequency = "Daily";
        this.icon = "💧";
        this.category = "Health";
        this.active = true;
        this.reminderTime = "08:00 AM";
    }

    // Overloaded Constructor 1 (Basic habit creation)
    public Habit(String habitName, int targetValue, String unit, String icon) {
        this();
        this.habitName = habitName;
        this.targetValue = targetValue;
        this.unit = unit;
        this.icon = icon;
    }

    // Overloaded Constructor 2 (Full fields for database entity mapping)
    public Habit(int userHabitId, int userId, String habitName, String description, int targetValue,
                 String unit, String frequency, String icon, String category, String reminderTime) {
        this.userHabitId = userHabitId;
        this.userId = userId;
        this.habitName = habitName;
        this.description = description;
        this.targetValue = targetValue;
        this.unit = unit;
        this.frequency = frequency;
        this.icon = icon;
        this.category = category;
        this.reminderTime = reminderTime;
        this.active = true;
        this.todayProgress = 0;
        this.completedToday = false;
        this.streakCount = 0;
    }

    // Method Overloading 1: Increments progress by a specified amount
    public void updateProgress(int amount) {
        this.todayProgress += amount;
        if (this.todayProgress >= this.targetValue) {
            this.completedToday = true;
        }
    }

    // Method Overloading 2: Updates progress and sets explicit completion status
    public void updateProgress(int amount, boolean markComplete) {
        this.todayProgress = amount;
        this.completedToday = markComplete;
    }

    // Trackable Interface implementation
    @Override
    public int getProgressPercentage() {
        if (this.targetValue <= 0) return 0;
        int pct = (int) Math.round(((double) this.todayProgress / this.targetValue) * 100);
        return Math.min(pct, 100);
    }

    @Override
    public boolean isGoalAchieved() {
        return this.completedToday || this.todayProgress >= this.targetValue;
    }

    @Override
    public String getTrackingMetric() {
        return this.todayProgress + " / " + this.targetValue + " " + this.unit;
    }

    // Getters and Setters
    public int getUserHabitId() {
        return userHabitId;
    }

    public void setUserHabitId(int userHabitId) {
        this.userHabitId = userHabitId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getHabitId() {
        return habitId;
    }

    public void setHabitId(int habitId) {
        this.habitId = habitId;
    }

    public String getHabitName() {
        return habitName;
    }

    public void setHabitName(String habitName) {
        this.habitName = habitName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(int targetValue) {
        this.targetValue = targetValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(String reminderTime) {
        this.reminderTime = reminderTime;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getTodayProgress() {
        return todayProgress;
    }

    public void setTodayProgress(int todayProgress) {
        this.todayProgress = todayProgress;
    }

    public boolean isCompletedToday() {
        return completedToday;
    }

    public void setCompletedToday(boolean completedToday) {
        this.completedToday = completedToday;
    }

    public int getStreakCount() {
        return streakCount;
    }

    public void setStreakCount(int streakCount) {
        this.streakCount = streakCount;
    }

    @Override
    public String toString() {
        return "Habit{" +
                "id=" + userHabitId +
                ", name='" + habitName + '\'' +
                ", target=" + targetValue + " " + unit +
                ", completed=" + completedToday +
                '}';
    }
}
