package com.thegrind.dao;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.User;
import com.thegrind.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Class: UserDAO
 * Implements Data Access Object pattern for User persistence.
 * Demonstrates:
 * - JDBC Connection handling
 * - PreparedStatement execution (preventing SQL injection)
 * - ResultSet traversal and object mapping
 * - Exception handling (try-catch-finally, throws DatabaseException)
 */
public class UserDAO {

    private final DBConnection dbConnection;

    public UserDAO() {
        this.dbConnection = DBConnection.getInstance();
    }

    /**
     * Inserts a new user record into the database.
     */
    public User registerUser(User user) throws DatabaseException {
        String sql = "INSERT INTO users (full_name, email, password_hash, avatar_url, current_streak, best_streak, total_completed) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, user.getFullName());
            pstmt.setString(2, user.getEmail());
            pstmt.setString(3, user.getPasswordHash());
            pstmt.setString(4, user.getAvatarUrl() != null ? user.getAvatarUrl() : "default_avatar.png");
            pstmt.setInt(5, user.getCurrentStreak());
            pstmt.setInt(6, user.getBestStreak());
            pstmt.setInt(7, user.getTotalCompleted());

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows == 0) {
                throw new DatabaseException("Creating user failed, no rows affected.");
            }

            rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                user.setId(rs.getInt(1));
            }
            return user;
        } catch (SQLException e) {
            throw new DatabaseException("Error registering user with email " + user.getEmail() + ": " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }

    /**
     * Finds a user by unique email address.
     */
    public User findByEmail(String email) throws DatabaseException {
        String sql = "SELECT user_id, full_name, email, password_hash, avatar_url, current_streak, best_streak, total_completed, created_at " +
                     "FROM users WHERE email = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, email);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                User user = new User(
                    rs.getInt("user_id"),
                    rs.getString("full_name"),
                    rs.getString("email"),
                    rs.getString("password_hash"),
                    rs.getInt("current_streak"),
                    rs.getInt("best_streak"),
                    rs.getInt("total_completed")
                );
                user.setAvatarUrl(rs.getString("avatar_url"));
                user.setCreatedAt(rs.getTimestamp("created_at"));
                return user;
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Error finding user by email: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }

    /**
     * Finds user by primary key ID.
     */
    public User findById(int userId) throws DatabaseException {
        String sql = "SELECT user_id, full_name, email, password_hash, avatar_url, current_streak, best_streak, total_completed, created_at " +
                     "FROM users WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                User user = new User(
                    rs.getInt("user_id"),
                    rs.getString("full_name"),
                    rs.getString("email"),
                    rs.getString("password_hash"),
                    rs.getInt("current_streak"),
                    rs.getInt("best_streak"),
                    rs.getInt("total_completed")
                );
                user.setAvatarUrl(rs.getString("avatar_url"));
                user.setCreatedAt(rs.getTimestamp("created_at"));
                return user;
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Error finding user by id: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }

    /**
     * Updates user streak and completed totals.
     */
    public boolean updateStreaksAndStats(int userId, int currentStreak, int bestStreak, int totalCompleted) throws DatabaseException {
        String sql = "UPDATE users SET current_streak = ?, best_streak = ?, total_completed = ? WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, currentStreak);
            pstmt.setInt(2, bestStreak);
            pstmt.setInt(3, totalCompleted);
            pstmt.setInt(4, userId);

            int rows = pstmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating user statistics: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(null, pstmt, conn);
        }
    }

    /**
     * Updates user profile (name, avatar).
     */
    public boolean updateProfile(int userId, String fullName, String avatarUrl) throws DatabaseException {
        String sql = "UPDATE users SET full_name = ?, avatar_url = ? WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, fullName);
            pstmt.setString(2, avatarUrl);
            pstmt.setInt(3, userId);

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating user profile: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(null, pstmt, conn);
        }
    }
}
