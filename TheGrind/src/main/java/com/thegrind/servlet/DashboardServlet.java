package com.thegrind.servlet;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.Habit;
import com.thegrind.model.Notification;
import com.thegrind.model.User;
import com.thegrind.service.HabitService;
import com.thegrind.service.ReminderService;
import com.thegrind.service.UserService;
import com.thegrind.util.DateUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Date;
import java.util.List;
import java.util.Vector;

/**
 * Class: DashboardServlet
 * Central dashboard controller. Prepares user habits, streaks, and progress metrics for dashboard.jsp.
 */
@WebServlet(name = "DashboardServlet", urlPatterns = {"/dashboard"})
public class DashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private UserService userService;
    private HabitService habitService;
    private ReminderService reminderService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.userService = new UserService();
        this.habitService = new HabitService();
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
            User user = userService.getUserById(userId);
            Date today = DateUtil.getTodaySqlDate();

            // Demonstrates Java Vector usage
            Vector<Habit> habitsVector = habitService.getUserHabitsVector(userId, today);

            // Compute completed count
            int completedCount = 0;
            for (Habit h : habitsVector) {
                if (h.isCompletedToday()) {
                    completedCount++;
                }
            }

            int totalHabits = habitsVector.size();
            int completionPercentage = totalHabits > 0 ? (int) Math.round(((double) completedCount / totalHabits) * 100) : 0;

            // Notifications
            List<Notification> notifications = reminderService.getNotifications(userId);

            // Forward model attributes to JSP
            request.setAttribute("user", user);
            request.setAttribute("habits", habitsVector);
            request.setAttribute("completedCount", completedCount);
            request.setAttribute("totalHabits", totalHabits);
            request.setAttribute("completionPercentage", completionPercentage);
            request.setAttribute("todayDateFormatted", DateUtil.formatTodayDisplay());
            request.setAttribute("notifications", notifications);

            request.getRequestDispatcher("/dashboard.jsp").forward(request, response);

        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Unable to load dashboard: " + e.getMessage());
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
