package com.thegrind.dao;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.Goal;
import com.thegrind.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Class: GoalDAO
 * Handles saving and retrieving onboarding goals for users.
 */
public class GoalDAO {

    private final DBConnection dbConnection;

    public GoalDAO() {
        this.dbConnection = DBConnection.getInstance();
    }

    public boolean saveGoals(int userId, List<String> goals) throws DatabaseException {
        if (goals == null || goals.isEmpty()) return false;

        String deleteSql = "DELETE FROM goals WHERE user_id = ?";
        String insertSql = "INSERT INTO goals (user_id, goal_title) VALUES (?, ?)";

        Connection conn = null;
        PreparedStatement deletePstmt = null;
        PreparedStatement insertPstmt = null;

        try {
            conn = dbConnection.getConnection();
            conn.setAutoCommit(false); // Demonstrates JDBC Transaction handling

            deletePstmt = conn.prepareStatement(deleteSql);
            deletePstmt.setInt(1, userId);
            deletePstmt.executeUpdate();

            insertPstmt = conn.prepareStatement(insertSql);
            for (String goal : goals) {
                insertPstmt.setInt(1, userId);
                insertPstmt.setString(2, goal);
                insertPstmt.addBatch();
            }
            insertPstmt.executeBatch();

            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    System.err.println("Rollback failed: " + ex.getMessage());
                }
            }
            throw new DatabaseException("Error saving user goals: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(null, deletePstmt, null);
            DBConnection.closeResources(null, insertPstmt, conn);
        }
    }

    public List<String> getUserGoals(int userId) throws DatabaseException {
        List<String> list = new ArrayList<>();
        String sql = "SELECT goal_title FROM goals WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                list.add(rs.getString("goal_title"));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving user goals: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }
}
