package com.thegrind.servlet;

import com.thegrind.model.ChatMessage;
import com.thegrind.model.ChatbotResponse;
import com.thegrind.service.ChatbotService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

/**
 * Class: ChatbotServlet
 * Controller for Grind Coach Chatbot.
 * Handles incoming AJAX queries, returns JSON responses with motivational guidance and suggestions.
 */
@WebServlet(name = "ChatbotServlet", urlPatterns = {"/chatbot", "/api/chat"})
public class ChatbotServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private ChatbotService chatbotService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.chatbotService = new ChatbotService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        int userId = (session != null && session.getAttribute("userId") != null) ?
                (Integer) session.getAttribute("userId") : 1;

        List<ChatMessage> history = chatbotService.getConversationHistory(userId);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < history.size(); i++) {
            ChatMessage m = history.get(i);
            json.append(String.format("{\"sender\":\"%s\",\"text\":\"%s\",\"intent\":\"%s\"}",
                    escapeJson(m.getSender()), escapeJson(m.getMessageText()), escapeJson(m.getIntent())));
            if (i < history.size() - 1) json.append(",");
        }
        json.append("]");

        response.getWriter().write(json.toString());
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        int userId = (session != null && session.getAttribute("userId") != null) ?
                (Integer) session.getAttribute("userId") : 1;

        String userMessage = request.getParameter("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            userMessage = "";
        }

        ChatbotResponse coachReply = chatbotService.processMessage(userId, userMessage);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        StringBuilder suggestionsJson = new StringBuilder("[");
        List<String> list = coachReply.getSuggestions();
        for (int i = 0; i < list.size(); i++) {
            suggestionsJson.append("\"").append(escapeJson(list.get(i))).append("\"");
            if (i < list.size() - 1) suggestionsJson.append(",");
        }
        suggestionsJson.append("]");

        String jsonResponse = String.format(
                "{\"reply\":\"%s\",\"intent\":\"%s\",\"suggestions\":%s,\"success\":%b}",
                escapeJson(coachReply.getReply()),
                escapeJson(coachReply.getIntentDetected()),
                suggestionsJson.toString(),
                coachReply.isSuccess()
        );

        response.getWriter().write(jsonResponse);
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
