package com.thegrind.model;

import java.io.Serializable;
import java.util.List;
import java.util.ArrayList;

/**
 * Class: ChatbotResponse
 * Output object containing Grind Coach's motivational reply and contextual suggestions.
 */
public class ChatbotResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String reply;
    private String intentDetected;
    private List<String> suggestions;
    private boolean success;

    public ChatbotResponse() {
        this.suggestions = new ArrayList<>();
        this.success = true;
    }

    public ChatbotResponse(String reply, String intentDetected) {
        this();
        this.reply = reply;
        this.intentDetected = intentDetected;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getIntentDetected() {
        return intentDetected;
    }

    public void setIntentDetected(String intentDetected) {
        this.intentDetected = intentDetected;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public void addSuggestion(String suggestion) {
        if (this.suggestions == null) {
            this.suggestions = new ArrayList<>();
        }
        this.suggestions.add(suggestion);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
