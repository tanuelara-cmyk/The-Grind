package com.thegrind.service;

import com.thegrind.dao.CompletionDAO;
import com.thegrind.dao.HabitDAO;
import com.thegrind.dao.UserDAO;
import com.thegrind.exception.DatabaseException;
import com.thegrind.exception.InvalidHabitException;
import com.thegrind.model.Habit;
import com.thegrind.model.User;
import com.thegrind.util.DateUtil;
import com.thegrind.util.ValidationUtil;

import java.sql.Date;
import java.util.List;
import java.util.Vector;

/**
 * Class: HabitService
 * Extends AbstractService (Inheritance).
 * Manages habit workflows, progress toggles, streak maintenance.
 * Demonstrates:
 * - Java Vectors and Arrays
 * - Custom exceptions (InvalidHabitException)
 * - Polymorphic method invocations
 */
public class HabitService extends AbstractService {

    private final HabitDAO habitDAO;
    private final CompletionDAO completionDAO;
    private final UserDAO userDAO;

    public HabitService() {
        super("HabitService");
        this.habitDAO = new HabitDAO();
        this.completionDAO = new CompletionDAO();
        this.userDAO = new UserDAO();
    }

    @Override
    public boolean isOperational() {
        return habitDAO != null && completionDAO != null;
    }

    public List<Habit> getMasterHabitsCatalog() throws DatabaseException {
        return habitDAO.getMasterHabitsCatalog();
    }

    /**
     * Demonstrates retrieval via Java Vector.
     */
    public Vector<Habit> getUserHabitsVector(int userId, Date date) throws DatabaseException {
        return habitDAO.getUserHabitsVector(userId, date);
    }

    /**
     * Demonstrates retrieval via Java Array.
     */
    public Habit[] getUserHabitsArray(int userId, Date date) throws DatabaseException {
        return habitDAO.getUserHabitsArray(userId, date);
    }

    /**
     * Adds custom habit with validation.
     */
    public boolean addCustomHabit(int userId, String habitName, String description, int targetValue,
                                  String unit, String frequency, String icon, String reminderTime)
            throws InvalidHabitException, DatabaseException {

        // Validate using overloaded method
        ValidationUtil.validateHabit(habitName, targetValue, unit);

        Habit h = new Habit();
        h.setUserId(userId);
        h.setHabitName(habitName.trim());
        h.setDescription(description != null ? description.trim() : "");
        h.setTargetValue(targetValue);
        h.setUnit(unit.trim());
        h.setFrequency(frequency != null ? frequency : "Daily");
        h.setIcon(icon != null ? icon : "⚡");
        h.setCategory("Custom");
        h.setReminderTime(reminderTime != null ? reminderTime : "08:00 PM");

        boolean created = habitDAO.addUserHabit(userId, h);
        if (created) {
            logAction("CUSTOM_HABIT_ADDED: " + habitName, userId);
        }
        return created;
    }

    /**
     * Marks habit complete or toggles status for today.
     * Recalculates streak and prevents duplicate counting.
     */
    public boolean toggleHabitCompletion(int userHabitId, int userId, boolean complete) throws DatabaseException {
        Habit habit = habitDAO.getUserHabitById(userHabitId);
        if (habit == null || habit.getUserId() != userId) {
            throw new DatabaseException("Unauthorized or non-existent habit id: " + userHabitId);
        }

        int progress = complete ? habit.getTargetValue() : 0;
        Date today = DateUtil.getTodaySqlDate();

        boolean logged = completionDAO.logCompletion(userHabitId, userId, today, progress, complete);
        if (logged) {
            // Update User streaks and overall count
            User user = userDAO.findById(userId);
            if (user != null) {
                int completedToday = completionDAO.getCompletedCountForDate(userId, today);
                Vector<Habit> allHabits = habitDAO.getUserHabitsVector(userId, today);

                if (complete) {
                    user.setTotalCompleted(user.getTotalCompleted() + 1);
                } else if (user.getTotalCompleted() > 0) {
                    user.setTotalCompleted(user.getTotalCompleted() - 1);
                }

                // If user finished all active habits today, increment streak
                if (!allHabits.isEmpty() && completedToday == allHabits.size()) {
                    user.setCurrentStreak(user.getCurrentStreak() + 1);
                }

                userDAO.updateStreaksAndStats(userId, user.getCurrentStreak(), user.getBestStreak(), user.getTotalCompleted());
            }
            logAction("HABIT_TOGGLED: " + userHabitId + " -> " + complete, userId);
        }
        return logged;
    }

    public Habit getHabitDetails(int userHabitId) throws DatabaseException {
        return habitDAO.getUserHabitById(userHabitId);
    }

    public boolean updateHabit(Habit habit) throws DatabaseException, InvalidHabitException {
        ValidationUtil.validateHabit(habit.getHabitName(), habit.getTargetValue(), habit.getUnit());
        return habitDAO.updateHabit(habit);
    }

    public boolean deleteHabit(int userHabitId, int userId) throws DatabaseException {
        return habitDAO.deleteUserHabit(userHabitId, userId);
    }
}
