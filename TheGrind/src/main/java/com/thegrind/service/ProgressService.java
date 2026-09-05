package com.thegrind.service;

import com.thegrind.dao.CompletionDAO;
import com.thegrind.dao.HabitDAO;
import com.thegrind.dao.UserDAO;
import com.thegrind.exception.DatabaseException;
import com.thegrind.model.Habit;
import com.thegrind.model.Progress;
import com.thegrind.model.User;
import com.thegrind.util.DateUtil;

import java.sql.Date;
import java.util.Vector;

/**
 * Class: ProgressService
 * Extends AbstractService. Computes analytics, streak stats, and weekly percentages.
 */
public class ProgressService extends AbstractService {

    private final CompletionDAO completionDAO;
    private final UserDAO userDAO;
    private final HabitDAO habitDAO;

    public ProgressService() {
        super("ProgressService");
        this.completionDAO = new CompletionDAO();
        this.userDAO = new UserDAO();
        this.habitDAO = new HabitDAO();
    }

    @Override
    public boolean isOperational() {
        return completionDAO != null && userDAO != null;
    }

    public Progress getUserProgress(int userId) throws DatabaseException {
        User user = userDAO.findById(userId);
        if (user == null) {
            throw new DatabaseException("User not found: " + userId);
        }

        Date today = DateUtil.getTodaySqlDate();
        Vector<Habit> habits = habitDAO.getUserHabitsVector(userId, today);
        int completedToday = completionDAO.getCompletedCountForDate(userId, today);
        int totalHabits = habits.size();

        int dailyRate = totalHabits > 0 ? (int) Math.round(((double) completedToday / totalHabits) * 100) : 0;
        int[] weeklyPercentages = completionDAO.getWeeklyDayPercentages(userId);

        int sumPct = 0;
        for (int p : weeklyPercentages) {
            sumPct += p;
        }
        int weeklyRate = Math.round((float) sumPct / weeklyPercentages.length);

        Progress progress = new Progress(
            userId,
            user.getTotalCompleted(),
            user.getCurrentStreak(),
            user.getBestStreak(),
            dailyRate,
            weeklyRate,
            user.getTotalCompleted() + 14 // Monthly estimate
        );
        progress.setDailyPercentages(weeklyPercentages);

        logAction("PROGRESS_CALCULATED", userId);
        return progress;
    }
}
