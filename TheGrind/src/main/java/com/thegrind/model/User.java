package com.thegrind.model;

import com.thegrind.interfaces.Authenticatable;
import com.thegrind.interfaces.Trackable;
import com.thegrind.util.PasswordUtil;

import java.util.Vector;
import java.util.ArrayList;
import java.util.List;

/**
 * Class: User
 * Demonstrates:
 * - Inheritance: extends abstract class Person
 * - Multiple Inheritance using interfaces: implements Authenticatable, Trackable
 * - super keyword usage in constructors and method invocations
 * - Method Overriding of abstract and base methods
 * - Encapsulation with private state and validation
 * - Java Collections & Vectors (syllabus requirement)
 */
public class User extends Person implements Authenticatable, Trackable {
    private static final long serialVersionUID = 1L;

    // Instance variables (Encapsulation)
    private String passwordHash;
    private String avatarUrl;
    private int currentStreak;
    private int bestStreak;
    private int totalCompleted;
    private List<String> goals;
    
    // Java Vector demonstration (specifically asked in syllabus)
    private Vector<Habit> activeHabitsVector;

    // Static counter (Static member)
    private static int totalRegisteredUsersCount = 0;

    // Default constructor
    public User() {
        super();
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.totalCompleted = 0;
        this.goals = new ArrayList<>();
        this.activeHabitsVector = new Vector<>();
        totalRegisteredUsersCount++;
    }

    // Overloaded Constructor 1: Basic registration details
    public User(String fullName, String email, String passwordHash) {
        super(0, fullName, email);
        this.passwordHash = passwordHash;
        this.avatarUrl = "default_avatar.png";
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.totalCompleted = 0;
        this.goals = new ArrayList<>();
        this.activeHabitsVector = new Vector<>();
        totalRegisteredUsersCount++;
    }

    // Overloaded Constructor 2: Full user details (demonstrates Constructor Overloading and super)
    public User(int id, String fullName, String email, String passwordHash, int currentStreak, int bestStreak, int totalCompleted) {
        super(id, fullName, email);
        this.passwordHash = passwordHash;
        this.avatarUrl = "default_avatar.png";
        this.currentStreak = currentStreak;
        this.bestStreak = bestStreak;
        this.totalCompleted = totalCompleted;
        this.goals = new ArrayList<>();
        this.activeHabitsVector = new Vector<>();
        totalRegisteredUsersCount++;
    }

    // Static method demonstrating class-level access
    public static int getTotalRegisteredUsersCount() {
        return totalRegisteredUsersCount;
    }

    // Method Overriding from Person (Polymorphic behavior)
    @Override
    public String getRoleDescription() {
        return "Habit Club Member pursuing personal consistency and mastery";
    }

    @Override
    public String getDisplayName() {
        // Message passing to superclass fields
        return this.fullName != null && !this.fullName.isEmpty() ? this.fullName : "Grinder";
    }

    // Implementation of Authenticatable interface
    @Override
    public boolean authenticate(String rawPassword) {
        if (rawPassword == null || this.passwordHash == null) {
            return false;
        }
        return PasswordUtil.verifyPassword(rawPassword, this.passwordHash);
    }

    @Override
    public String getPasswordHash() {
        return this.passwordHash;
    }

    // Implementation of Trackable interface
    @Override
    public int getProgressPercentage() {
        if (activeHabitsVector.isEmpty()) return 0;
        int completedCount = 0;
        for (Habit h : activeHabitsVector) {
            if (h.isCompletedToday()) {
                completedCount++;
            }
        }
        return (int) Math.round(((double) completedCount / activeHabitsVector.size()) * 100);
    }

    @Override
    public boolean isGoalAchieved() {
        return getProgressPercentage() == 100;
    }

    @Override
    public String getTrackingMetric() {
        return "Streak: " + currentStreak + " Days | Best: " + bestStreak + " Days";
    }

    // Habit management using Java Vector
    public void addHabitToVector(Habit habit) {
        if (habit != null) {
            this.activeHabitsVector.addElement(habit);
        }
    }

    public Vector<Habit> getActiveHabitsVector() {
        return this.activeHabitsVector;
    }

    public void setActiveHabitsVector(Vector<Habit> activeHabitsVector) {
        this.activeHabitsVector = activeHabitsVector;
    }

    // Getters and Setters
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
    }

    public int getBestStreak() {
        return bestStreak;
    }

    public void setBestStreak(int bestStreak) {
        this.bestStreak = bestStreak;
    }

    public int getTotalCompleted() {
        return totalCompleted;
    }

    public void setTotalCompleted(int totalCompleted) {
        this.totalCompleted = totalCompleted;
    }

    public List<String> getGoals() {
        return goals;
    }

    public void setGoals(List<String> goals) {
        this.goals = goals;
    }

    public void addGoal(String goal) {
        if (this.goals == null) {
            this.goals = new ArrayList<>();
        }
        this.goals.add(goal);
    }

    @Override
    public String toString() {
        // Utilizing super.toString() (demonstrating super keyword)
        return "User{" + super.toString() +
                ", currentStreak=" + currentStreak +
                ", bestStreak=" + bestStreak +
                ", totalCompleted=" + totalCompleted +
                '}';
    }
}
