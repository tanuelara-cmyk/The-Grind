package com.thegrind.service;

import com.thegrind.dao.ChatbotDAO;
import com.thegrind.dao.CompletionDAO;
import com.thegrind.dao.HabitDAO;
import com.thegrind.dao.UserDAO;
import com.thegrind.exception.DatabaseException;
import com.thegrind.interfaces.ChatbotStrategy;
import com.thegrind.model.ChatMessage;
import com.thegrind.model.ChatbotResponse;
import com.thegrind.model.Habit;
import com.thegrind.model.User;
import com.thegrind.util.DateUtil;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 * Class: ChatbotService
 * Implements "Grind Coach" habit advisor chatbot.
 * Demonstrates:
 * - OOP & Polymorphism via ChatbotStrategy implementations
 * - Contextual habit retrieval via JDBC
 * - Robust fallback and rule-based intent routing
 * - Optional AI API integration layer hook
 */
public class ChatbotService extends AbstractService {

    private final ChatbotDAO chatbotDAO;
    private final HabitDAO habitDAO;
    private final CompletionDAO completionDAO;
    private final UserDAO userDAO;

    // Polymorphic collection of strategies (Demonstrates Polymorphism & OOP)
    private final List<ChatbotStrategy> strategies;

    public ChatbotService() {
        super("ChatbotService");
        this.chatbotDAO = new ChatbotDAO();
        this.habitDAO = new HabitDAO();
        this.completionDAO = new CompletionDAO();
        this.userDAO = new UserDAO();

        this.strategies = new ArrayList<>();
        // Register Polymorphic Strategies
        strategies.add(new MissedHabitStrategy());
        strategies.add(new MotivationStrategy());
        strategies.add(new TodayFocusStrategy());
        strategies.add(new ProgressStreakStrategy());
        strategies.add(new GeneralAdviceStrategy());
    }

    @Override
    public boolean isOperational() {
        return chatbotDAO != null && habitDAO != null;
    }

    /**
     * Processes incoming user query, generates a context-aware coach response,
     * and logs the conversation to MySQL.
     */
    public ChatbotResponse processMessage(int userId, String userMessage) {
        ChatbotResponse response = new ChatbotResponse();

        // 1. Validate empty input gracefully
        if (userMessage == null || userMessage.trim().isEmpty()) {
            response.setReply("Hey there! I'm your Grind Coach. How can I help you build consistency today?");
            response.setIntentDetected("GREETING");
            response.addSuggestion("How am I doing?");
            response.addSuggestion("What should I focus on today?");
            response.addSuggestion("I need some motivation");
            return response;
        }

        String cleanedMsg = userMessage.trim();
        String lower = cleanedMsg.toLowerCase();

        try {
            // Load contextual user details from MySQL
            User user = userDAO.findById(userId);
            if (user == null) {
                user = new User();
                user.setId(userId);
                user.setFullName("Grinder");
            }

            Date today = DateUtil.getTodaySqlDate();
            Vector<Habit> habits = habitDAO.getUserHabitsVector(userId, today);
            user.setActiveHabitsVector(habits);

            // Detect intent
            String intent = detectIntent(lower);

            // Execute matching polymorphic strategy
            boolean handled = false;
            for (ChatbotStrategy strategy : strategies) {
                if (strategy.canHandle(cleanedMsg, intent)) {
                    response = strategy.generateResponse(user, cleanedMsg);
                    handled = true;
                    break;
                }
            }

            if (!handled) {
                response = new GeneralAdviceStrategy().generateResponse(user, cleanedMsg);
            }

            // Persist conversation in database
            chatbotDAO.saveMessage(userId, "USER", cleanedMsg, intent);
            chatbotDAO.saveMessage(userId, "COACH", response.getReply(), response.getIntentDetected());

            logAction("CHAT_PROCESSED intent=" + response.getIntentDetected(), userId);

        } catch (DatabaseException e) {
            // Graceful fallback on database error
            response.setReply("I'm having a little trouble accessing your live habits right now, but remember: consistency is built one small step at a time!");
            response.setIntentDetected("ERROR_FALLBACK");
            response.addSuggestion("Show my streak");
        }

        return response;
    }

    private String detectIntent(String msg) {
        if (msg.contains("missed") || msg.contains("skipped") || msg.contains("failed") || msg.contains("forgot")) {
            return "MISSED_HABIT";
        }
        if (msg.contains("motivation") || msg.contains("inspire") || msg.contains("hard") || msg.contains("lazy") || msg.contains("give up")) {
            return "MOTIVATION";
        }
        if (msg.contains("focus") || msg.contains("today") || msg.contains("next") || msg.contains("plan") || msg.contains("start")) {
            return "TODAY_FOCUS";
        }
        if (msg.contains("progress") || msg.contains("doing") || msg.contains("streak") || msg.contains("stats") || msg.contains("score")) {
            return "PROGRESS_STREAK";
        }
        return "GENERAL";
    }

    public List<ChatMessage> getConversationHistory(int userId) {
        try {
            return chatbotDAO.getChatHistory(userId);
        } catch (DatabaseException e) {
            return new ArrayList<>();
        }
    }

    // =========================================================================
    // INNER CLASSES DEMONSTRATING POLYMORPHISM VIA ChatbotStrategy IMPLEMENTATION
    // =========================================================================

    /**
     * Strategy 1: Handles missed habits with supportive coaching.
     */
    private static class MissedHabitStrategy implements ChatbotStrategy {
        @Override
        public boolean canHandle(String messageText, String intent) {
            return "MISSED_HABIT".equals(intent) || messageText.toLowerCase().contains("missed");
        }

        @Override
        public ChatbotResponse generateResponse(User user, String userMessage) {
            ChatbotResponse res = new ChatbotResponse();
            res.setIntentDetected("MISSED_HABIT");
            res.setReply("That's completely okay! Missing one day doesn't erase your progress. " +
                         "Consistency isn't about perfection; it's about not missing twice. " +
                         "Try a quick 5-10 minute micro-action today to keep the mental momentum alive!");
            res.addSuggestion("What should I focus on today?");
            res.addSuggestion("How am I doing?");
            return res;
        }
    }

    /**
     * Strategy 2: Supplies encouraging motivation and mindset tips.
     */
    private static class MotivationStrategy implements ChatbotStrategy {
        @Override
        public boolean canHandle(String messageText, String intent) {
            return "MOTIVATION".equals(intent) || messageText.toLowerCase().contains("motivat");
        }

        @Override
        public ChatbotResponse generateResponse(User user, String userMessage) {
            ChatbotResponse res = new ChatbotResponse();
            res.setIntentDetected("MOTIVATION");
            res.setReply("Remember why you started with 'The Grind': Small steps. Big changes. " +
                         "You don't need intense motivation; you just need to start for 2 minutes. " +
                         "Your future self is thanking you for showing up today!");
            res.addSuggestion("What should I focus on today?");
            res.addSuggestion("Show my current streak");
            return res;
        }
    }

    /**
     * Strategy 3: Analyzes uncompleted habits for today and suggests next step.
     */
    private static class TodayFocusStrategy implements ChatbotStrategy {
        @Override
        public boolean canHandle(String messageText, String intent) {
            return "TODAY_FOCUS".equals(intent);
        }

        @Override
        public ChatbotResponse generateResponse(User user, String userMessage) {
            ChatbotResponse res = new ChatbotResponse();
            res.setIntentDetected("TODAY_FOCUS");

            Vector<Habit> habits = user.getActiveHabitsVector();
            List<String> pending = new ArrayList<>();

            if (habits != null) {
                for (Habit h : habits) {
                    if (!h.isCompletedToday()) {
                        pending.add(h.getHabitName());
                    }
                }
            }

            if (pending.isEmpty()) {
                res.setReply("Outstanding work, " + user.getDisplayName() + "! You've completed all your habits for today! " +
                             "Take a moment to celebrate your discipline, rest well, and get ready for tomorrow.");
                res.addSuggestion("How is my weekly progress?");
            } else {
                String firstHabit = pending.get(0);
                res.setReply("Based on your list, you still have " + pending.size() + " habit" + (pending.size() > 1 ? "s" : "") +
                             " pending: " + String.join(", ", pending) + ". " +
                             "I suggest tackling '" + firstHabit + "' first. Knock it out and check it off!");
                res.addSuggestion("I finished " + firstHabit);
                res.addSuggestion("Give me some motivation");
            }
            return res;
        }
    }

    /**
     * Strategy 4: Reports current streaks and daily completion metrics.
     */
    private static class ProgressStreakStrategy implements ChatbotStrategy {
        @Override
        public boolean canHandle(String messageText, String intent) {
            return "PROGRESS_STREAK".equals(intent);
        }

        @Override
        public ChatbotResponse generateResponse(User user, String userMessage) {
            ChatbotResponse res = new ChatbotResponse();
            res.setIntentDetected("PROGRESS_STREAK");

            Vector<Habit> habits = user.getActiveHabitsVector();
            int total = habits != null ? habits.size() : 0;
            int completed = 0;
            if (habits != null) {
                for (Habit h : habits) {
                    if (h.isCompletedToday()) completed++;
                }
            }

            int streak = user.getCurrentStreak() > 0 ? user.getCurrentStreak() : 1;
            res.setReply("You've completed " + completed + " of " + total + " habits today (" +
                         (total > 0 ? Math.round(((double)completed/total)*100) : 0) + "%), " +
                         "and you're currently on a " + streak + "-day streak! Keep the flame burning! 🔥");
            res.addSuggestion("What should I focus on today?");
            res.addSuggestion("How do I maintain my streak?");
            return res;
        }
    }

    /**
     * Strategy 5: General fallback advice.
     */
    private static class GeneralAdviceStrategy implements ChatbotStrategy {
        @Override
        public boolean canHandle(String messageText, String intent) {
            return true;
        }

        @Override
        public ChatbotResponse generateResponse(User user, String userMessage) {
            ChatbotResponse res = new ChatbotResponse();
            res.setIntentDetected("GENERAL");
            res.setReply("I'm here as your Grind Coach! Ask me about your habits, motivation, daily planning, or how to bounce back if you missed a day.");
            res.addSuggestion("How am I doing?");
            res.addSuggestion("What should I focus on today?");
            res.addSuggestion("I missed my workout today");
            return res;
        }
    }
}
