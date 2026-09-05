package com.thegrind.interfaces;

import com.thegrind.model.User;
import com.thegrind.model.ChatbotResponse;

/**
 * Interface: ChatbotStrategy
 * Demonstrates Polymorphism and Strategy Pattern in Java OOP.
 * Different response strategies process user queries (Motivation, Progress, Reminder, Help).
 */
public interface ChatbotStrategy {
    boolean canHandle(String messageText, String intent);
    ChatbotResponse generateResponse(User user, String userMessage);
}
