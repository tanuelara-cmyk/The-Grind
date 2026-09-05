package com.thegrind.dao;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.Reminder;
import com.thegrind.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Class: ReminderDAO
 * Manages persistence for daily reminder preferences.
 */
public class ReminderDAO {

    private final DBConnection dbConnection;

    public ReminderDAO() {
        this.dbConnection = DBConnection.getInstance();
    }

    public boolean saveReminder(int userId, String reminderTime, boolean enabled) throws DatabaseException {
        String sql = "INSERT INTO reminders (user_id, reminder_time, is_enabled) VALUES (?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE reminder_time = VALUES(reminder_time), is_enabled = VALUES(is_enabled)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            pstmt.setString(2, reminderTime);
            pstmt.setBoolean(3, enabled);

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error saving reminder preference: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(null, pstmt, conn);
        }
    }

    public Reminder getReminder(int userId) throws DatabaseException {
        String sql = "SELECT reminder_id, user_id, reminder_time, is_enabled, notification_channel, updated_at " +
                     "FROM reminders WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                return new Reminder(
                    rs.getInt("reminder_id"),
                    rs.getInt("user_id"),
                    rs.getString("reminder_time"),
                    rs.getBoolean("is_enabled"),
                    rs.getString("notification_channel"),
                    rs.getTimestamp("updated_at")
                );
            }
            return new Reminder(userId, "08:00 AM", true);
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving reminder: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }

    public List<Reminder> getAllActiveReminders() throws DatabaseException {
        List<Reminder> list = new ArrayList<>();
        String sql = "SELECT reminder_id, user_id, reminder_time, is_enabled, notification_channel, updated_at " +
                     "FROM reminders WHERE is_enabled = TRUE";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                list.add(new Reminder(
                    rs.getInt("reminder_id"),
                    rs.getInt("user_id"),
                    rs.getString("reminder_time"),
                    rs.getBoolean("is_enabled"),
                    rs.getString("notification_channel"),
                    rs.getTimestamp("updated_at")
                ));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching active reminders: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }
}
