package com.thegrind.dao;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.ChatMessage;
import com.thegrind.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Class: ChatbotDAO
 * Persists chat messages and retrieves chat history for Grind Coach.
 */
public class ChatbotDAO {

    private final DBConnection dbConnection;

    public ChatbotDAO() {
        this.dbConnection = DBConnection.getInstance();
    }

    public boolean saveMessage(int userId, String sender, String messageText, String intent) throws DatabaseException {
        String sql = "INSERT INTO chat_messages (user_id, sender, message_text, intent) VALUES (?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            pstmt.setString(2, sender);
            pstmt.setString(3, messageText);
            pstmt.setString(4, intent != null ? intent : "GENERAL");

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error saving chat message: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(null, pstmt, conn);
        }
    }

    public List<ChatMessage> getChatHistory(int userId) throws DatabaseException {
        List<ChatMessage> list = new ArrayList<>();
        String sql = "SELECT message_id, user_id, sender, message_text, intent, created_at " +
                     "FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC LIMIT 50";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = dbConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, userId);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                ChatMessage msg = new ChatMessage();
                msg.setMessageId(rs.getInt("message_id"));
                msg.setUserId(rs.getInt("user_id"));
                msg.setSender(rs.getString("sender"));
                msg.setMessageText(rs.getString("message_text"));
                msg.setIntent(rs.getString("intent"));
                msg.setCreatedAt(rs.getTimestamp("created_at"));
                list.add(msg);
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving chat history: " + e.getMessage(), e);
        } finally {
            DBConnection.closeResources(rs, pstmt, conn);
        }
    }
}
