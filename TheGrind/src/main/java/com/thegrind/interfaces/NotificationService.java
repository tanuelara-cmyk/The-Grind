package com.thegrind.interfaces;

import com.thegrind.model.Notification;

/**
 * Interface: NotificationService
 * Demonstrates Interface-based design for notification dispatching.
 */
public interface NotificationService {
    boolean sendNotification(int userId, String title, String message, String type);
    int checkDueReminders();
}
