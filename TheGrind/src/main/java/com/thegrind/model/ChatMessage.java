package com.thegrind.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Class: ChatMessage
 * Represents messages exchanged between user and Grind Coach Chatbot.
 */
public class ChatMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private int messageId;
    private int userId;
    private String sender; // USER or COACH
    private String messageText;
    private String intent;
    private Timestamp createdAt;

    public ChatMessage() {}

    public ChatMessage(int userId, String sender, String messageText, String intent) {
        this.userId = userId;
        this.sender = sender;
        this.messageText = messageText;
        this.intent = intent;
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }

    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
