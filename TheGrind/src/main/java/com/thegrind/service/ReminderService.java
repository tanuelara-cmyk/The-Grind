package com.thegrind.service;

import com.thegrind.dao.NotificationDAO;
import com.thegrind.dao.ReminderDAO;
import com.thegrind.exception.DatabaseException;
import com.thegrind.interfaces.NotificationService;
import com.thegrind.model.Notification;
import com.thegrind.model.Reminder;

import java.util.List;

/**
 * Class: ReminderService
 * Extends AbstractService and implements NotificationService interface.
 * Demonstrates:
 * - Interface Implementation
 * - Multithreaded interaction support
 */
public class ReminderService extends AbstractService implements NotificationService {

    private final ReminderDAO reminderDAO;
    private final NotificationDAO notificationDAO;

    public ReminderService() {
        super("ReminderService");
        this.reminderDAO = new ReminderDAO();
        this.notificationDAO = new NotificationDAO();
    }

    @Override
    public boolean isOperational() {
        return reminderDAO != null && notificationDAO != null;
    }

    @Override
    public boolean sendNotification(int userId, String title, String message, String type) {
        try {
            boolean created = notificationDAO.createNotification(userId, title, message, type);
            if (created) {
                logAction("NOTIFICATION_DISPATCHED: " + title, userId);
            }
            return created;
        } catch (DatabaseException e) {
            System.err.println("[ReminderService] Failed to send notification: " + e.getMessage());
            return false;
        }
    }

    @Override
    public int checkDueReminders() {
        try {
            List<Reminder> active = reminderDAO.getAllActiveReminders();
            int sentCount = 0;
            for (Reminder r : active) {
                // In production, compare against current time.
                // Here we dispatch reminder notification
                sendNotification(r.getUserId(), "Habit Reminder ⏰",
                        "Time to stay consistent! Complete your scheduled habits today.", "REMINDER");
                sentCount++;
            }
            return sentCount;
        } catch (DatabaseException e) {
            System.err.println("[ReminderService] Error checking due reminders: " + e.getMessage());
            return 0;
        }
    }

    public boolean saveReminderSettings(int userId, String reminderTime, boolean enabled) throws DatabaseException {
        return reminderDAO.saveReminder(userId, reminderTime, enabled);
    }

    public Reminder getReminderSettings(int userId) throws DatabaseException {
        return reminderDAO.getReminder(userId);
    }

    public List<Notification> getNotifications(int userId) throws DatabaseException {
        return notificationDAO.getUserNotifications(userId);
    }

    public boolean markNotificationsRead(int userId) throws DatabaseException {
        return notificationDAO.markAllAsRead(userId);
    }
}
