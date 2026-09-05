package com.thegrind.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Class: Reminder
 * Stores user daily notification schedules and preferences.
 */
public class Reminder implements Serializable {
    private static final long serialVersionUID = 1L;

    private int reminderId;
    private int userId;
    private String reminderTime;
    private boolean enabled;
    private String notificationChannel;
    private Timestamp updatedAt;

    public Reminder() {
        this.reminderTime = "08:00 AM";
        this.enabled = true;
        this.notificationChannel = "Browser/Push";
    }

    public Reminder(int userId, String reminderTime, boolean enabled) {
        this.userId = userId;
        this.reminderTime = reminderTime;
        this.enabled = enabled;
        this.notificationChannel = "Browser/Push";
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }

    public Reminder(int reminderId, int userId, String reminderTime, boolean enabled, String channel, Timestamp updatedAt) {
        this.reminderId = reminderId;
        this.userId = userId;
        this.reminderTime = reminderTime;
        this.enabled = enabled;
        this.notificationChannel = channel;
        this.updatedAt = updatedAt;
    }

    public int getReminderId() {
        return reminderId;
    }

    public void setReminderId(int reminderId) {
        this.reminderId = reminderId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(String reminderTime) {
        this.reminderTime = reminderTime;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getNotificationChannel() {
        return notificationChannel;
    }

    public void setNotificationChannel(String notificationChannel) {
        this.notificationChannel = notificationChannel;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
