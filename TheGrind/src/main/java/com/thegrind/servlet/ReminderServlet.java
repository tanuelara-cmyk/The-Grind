package com.thegrind.servlet;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.Reminder;
import com.thegrind.service.ReminderService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Class: ReminderServlet
 * Manages reminder configuration page and updates.
 */
@WebServlet(name = "ReminderServlet", urlPatterns = {"/reminders"})
public class ReminderServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private ReminderService reminderService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.reminderService = new ReminderService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        int userId = (Integer) session.getAttribute("userId");
        try {
            Reminder reminder = reminderService.getReminderSettings(userId);
            request.setAttribute("reminder", reminder);
            request.getRequestDispatcher("/reminders.jsp").forward(request, response);
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Error loading reminder: " + e.getMessage());
            request.getRequestDispatcher("/dashboard").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        int userId = (Integer) session.getAttribute("userId");
        String reminderTime = request.getParameter("reminderTime");
        String enabledStr = request.getParameter("enabled");
        boolean enabled = "true".equalsIgnoreCase(enabledStr) || "on".equalsIgnoreCase(enabledStr);

        try {
            reminderService.saveReminderSettings(userId, reminderTime != null ? reminderTime : "08:00 AM", enabled);

            String fromOnboarding = request.getParameter("onboarding");
            if ("true".equalsIgnoreCase(fromOnboarding)) {
                response.sendRedirect(request.getContextPath() + "/dashboard?welcome=true");
            } else {
                response.sendRedirect(request.getContextPath() + "/settings.jsp?updated=true");
            }
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Error updating reminders: " + e.getMessage());
            request.getRequestDispatcher("/reminders.jsp").forward(request, response);
        }
    }
}
