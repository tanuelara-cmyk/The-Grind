package com.thegrind.dao;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.Notification;
import com.thegrind.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Class: NotificationDAO
 * Handles alert and reminder notification storage and retrieval.
 */
public class NotificationDAO {

    private final DBConnection dbConnection;

    public NotificationDAO() {
        this.dbConnection = DBConnection.getInstance();
    }

    public boolean createNotification(int userId, String title, String message, String type) throws DatabaseException {
        String sql = "INSERT INTO notifications (user_id, title, message, notification_type, is_read) VALUES (?, ?, ?, ?, FALSE)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            pstmt.setString(2, title);
            pstmt.setString(3, message);
            pstmt.setString(4, type);

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating notification: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(null, pstmt, conn);
        }
    }

    public List<Notification> getUserNotifications(int userId) throws DatabaseException {
        List<Notification> list = new ArrayList<>();
        String sql = "SELECT notification_id, user_id, title, message, is_read, notification_type, created_at " +
                     "FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                Notification n = new Notification();
                n.setNotificationId(rs.getInt("notification_id"));
                n.setUserId(rs.getInt("user_id"));
                n.setTitle(rs.getString("title"));
                n.setMessage(rs.getString("message"));
                n.setRead(rs.getBoolean("is_read"));
                n.setType(rs.getString("notification_type"));
                n.setCreatedAt(rs.getTimestamp("created_at"));
                list.add(n);
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving notifications: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }

    public boolean markAllAsRead(int userId) throws DatabaseException {
        String sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error marking notifications as read: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(null, pstmt, conn);
        }
    }
}
