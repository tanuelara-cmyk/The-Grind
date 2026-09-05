package com.thegrind.dao;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.Habit;
import com.thegrind.util.DBConnection;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 * Class: HabitDAO
 * Implements CRUD operations for habits and user habit subscriptions.
 * Demonstrates:
 * - Java Vectors and Arrays (specifically required by syllabus)
 * - JDBC PreparedStatements with parameter binding
 * - Multi-table JOIN queries with habit_completions
 * - Proper resource management and exception propagation
 */
public class HabitDAO {

    private final DBConnection dbConnection;

    public HabitDAO() {
        this.dbConnection = DBConnection.getInstance();
    }

    /**
     * Retrieves all master habits available in the catalog.
     */
    public List<Habit> getMasterHabitsCatalog() throws DatabaseException {
        List<Habit> catalog = new ArrayList<>();
        String sql = "SELECT habit_id, habit_name, description, default_target, unit, frequency, icon, category " +
                     "FROM habits ORDER BY habit_id ASC";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                Habit h = new Habit();
                h.setHabitId(rs.getInt("habit_id"));
                h.setHabitName(rs.getString("habit_name"));
                h.setDescription(rs.getString("description"));
                h.setTargetValue(rs.getInt("default_target"));
                h.setUnit(rs.getString("unit"));
                h.setFrequency(rs.getString("frequency"));
                h.setIcon(rs.getString("icon"));
                h.setCategory(rs.getString("category"));
                catalog.add(h);
            }
            return catalog;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving master habits: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }

    /**
     * Retrieves active habits for a user, returning a Java Vector<Habit>.
     * Demonstrates Java Vector requirement from syllabus.
     */
    public Vector<Habit> getUserHabitsVector(int userId, Date date) throws DatabaseException {
        Vector<Habit> vector = new Vector<>();
        String sql = "SELECT uh.user_habit_id, uh.user_id, uh.habit_id, uh.habit_name, uh.description, " +
                     "uh.target_value, uh.unit, uh.frequency, uh.icon, uh.category, uh.reminder_time, uh.is_active, " +
                     "hc.progress_value, hc.is_completed " +
                     "FROM user_habits uh " +
                     "LEFT JOIN habit_completions hc ON uh.user_habit_id = hc.user_habit_id AND hc.completion_date = ? " +
                     "WHERE uh.user_id = ? AND uh.is_active = TRUE " +
                     "ORDER BY uh.user_habit_id ASC";

        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setDate(1, date != null ? date : new Date(System.currentTimeMillis()));
            pstmt.setInt(2, userId);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                Habit habit = new Habit(
                    rs.getInt("user_habit_id"),
                    rs.getInt("user_id"),
                    rs.getString("habit_name"),
                    rs.getString("description"),
                    rs.getInt("target_value"),
                    rs.getString("unit"),
                    rs.getString("frequency"),
                    rs.getString("icon"),
                    rs.getString("category"),
                    rs.getString("reminder_time")
                );
                habit.setHabitId(rs.getInt("habit_id"));
                habit.setActive(rs.getBoolean("is_active"));

                int progress = rs.getInt("progress_value");
                boolean completed = rs.getBoolean("is_completed");
                habit.setTodayProgress(progress);
                habit.setCompletedToday(completed);

                // Add to Vector (demonstrating Vector.addElement / Vector.add)
                vector.addElement(habit);
            }
            return vector;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving user habits vector: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }

    /**
     * Demonstrates Java Array conversion and retrieval from syllabus.
     */
    public Habit[] getUserHabitsArray(int userId, Date date) throws DatabaseException {
        Vector<Habit> vector = getUserHabitsVector(userId, date);
        Habit[] array = new Habit[vector.size()];
        return vector.toArray(array);
    }

    /**
     * Subscribes a user to a habit from catalog.
     */
    public boolean addUserHabit(int userId, Habit habit) throws DatabaseException {
        String sql = "INSERT INTO user_habits (user_id, habit_id, habit_name, description, target_value, unit, frequency, icon, category, reminder_time) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            if (habit.getHabitId() > 0) {
                pstmt.setInt(2, habit.getHabitId());
            } else {
                pstmt.setNull(2, java.sql.Types.INTEGER);
            }
            pstmt.setString(3, habit.getHabitName());
            pstmt.setString(4, habit.getDescription());
            pstmt.setInt(5, habit.getTargetValue());
            pstmt.setString(6, habit.getUnit());
            pstmt.setString(7, habit.getFrequency() != null ? habit.getFrequency() : "Daily");
            pstmt.setString(8, habit.getIcon() != null ? habit.getIcon() : "💧");
            pstmt.setString(9, habit.getCategory() != null ? habit.getCategory() : "General");
            pstmt.setString(10, habit.getReminderTime() != null ? habit.getReminderTime() : "08:00 AM");

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating user habit: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(null, pstmt, conn);
        }
    }

    /**
     * Gets detailed information for a single user habit by its ID.
     */
    public Habit getUserHabitById(int userHabitId) throws DatabaseException {
        String sql = "SELECT user_habit_id, user_id, habit_id, habit_name, description, " +
                     "target_value, unit, frequency, icon, category, reminder_time, is_active " +
                     "FROM user_habits WHERE user_habit_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userHabitId);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                Habit h = new Habit(
                    rs.getInt("user_habit_id"),
                    rs.getInt("user_id"),
                    rs.getString("habit_name"),
                    rs.getString("description"),
                    rs.getInt("target_value"),
                    rs.getString("unit"),
                    rs.getString("frequency"),
                    rs.getString("icon"),
                    rs.getString("category"),
                    rs.getString("reminder_time")
                );
                h.setHabitId(rs.getInt("habit_id"));
                h.setActive(rs.getBoolean("is_active"));
                return h;
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving user habit details: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }

    /**
     * Updates an existing user habit.
     */
    public boolean updateHabit(Habit habit) throws DatabaseException {
        String sql = "UPDATE user_habits SET habit_name = ?, description = ?, target_value = ?, unit = ?, " +
                     "frequency = ?, icon = ?, reminder_time = ? WHERE user_habit_id = ? AND user_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, habit.getHabitName());
            pstmt.setString(2, habit.getDescription());
            pstmt.setInt(3, habit.getTargetValue());
            pstmt.setString(4, habit.getUnit());
            pstmt.setString(5, habit.getFrequency());
            pstmt.setString(6, habit.getIcon());
            pstmt.setString(7, habit.getReminderTime());
            pstmt.setInt(8, habit.getUserHabitId());
            pstmt.setInt(9, habit.getUserId());

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating habit: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(null, pstmt, conn);
        }
    }

    /**
     * Deactivates/deletes a habit for a user.
     */
    public boolean deleteUserHabit(int userHabitId, int userId) throws DatabaseException {
        String sql = "DELETE FROM user_habits WHERE user_habit_id = ? AND user_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userHabitId);
            pstmt.setInt(2, userId);

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error deleting user habit: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(null, pstmt, conn);
        }
    }
}
