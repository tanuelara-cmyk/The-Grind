package com.thegrind.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

/**
 * Class: HabitCompletion
 * Encapsulates daily logs of habit progress and completion flags.
 */
public class HabitCompletion implements Serializable {
    private static final long serialVersionUID = 1L;

    private int completionId;
    private int userHabitId;
    private int userId;
    private Date completionDate;
    private int progressValue;
    private boolean completed;
    private Timestamp completedAt;

    public HabitCompletion() {}

    public HabitCompletion(int userHabitId, int userId, Date completionDate, int progressValue, boolean completed) {
        this.userHabitId = userHabitId;
        this.userId = userId;
        this.completionDate = completionDate;
        this.progressValue = progressValue;
        this.completed = completed;
        this.completedAt = new Timestamp(System.currentTimeMillis());
    }

    public int getCompletionId() {
        return completionId;
    }

    public void setCompletionId(int completionId) {
        this.completionId = completionId;
    }

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

    public Date getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(Date completionDate) {
        this.completionDate = completionDate;
    }

    public int getProgressValue() {
        return progressValue;
    }

    public void setProgressValue(int progressValue) {
        this.progressValue = progressValue;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Timestamp getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Timestamp completedAt) {
        this.completedAt = completedAt;
    }
}
