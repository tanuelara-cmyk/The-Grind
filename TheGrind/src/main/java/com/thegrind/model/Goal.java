package com.thegrind.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Class: Goal
 * Represents user consistency and lifestyle goals selected during onboarding.
 */
public class Goal implements Serializable {
    private static final long serialVersionUID = 1L;

    private int goalId;
    private int userId;
    private String goalTitle;
    private Timestamp createdAt;

    public Goal() {}

    public Goal(int userId, String goalTitle) {
        this.userId = userId;
        this.goalTitle = goalTitle;
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }

    public Goal(int goalId, int userId, String goalTitle, Timestamp createdAt) {
        this.goalId = goalId;
        this.userId = userId;
        this.goalTitle = goalTitle;
        this.createdAt = createdAt;
    }

    public int getGoalId() {
        return goalId;
    }

    public void setGoalId(int goalId) {
        this.goalId = goalId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getGoalTitle() {
        return goalTitle;
    }

    public void setGoalTitle(String goalTitle) {
        this.goalTitle = goalTitle;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
