package com.thegrind.servlet;

import com.thegrind.exception.DatabaseException;
import com.thegrind.service.HabitService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Class: CompleteHabitServlet
 * Handles habit completion toggling via AJAX or direct POST.
 * Updates streak, progress, and database records safely.
 */
@WebServlet(name = "CompleteHabitServlet", urlPatterns = {"/complete-habit"})
public class CompleteHabitServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private HabitService habitService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.habitService = new HabitService();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"success\":false,\"message\":\"Unauthorized\"}");
            return;
        }

        int userId = (Integer) session.getAttribute("userId");
        String habitIdStr = request.getParameter("habitId");
        String completedStr = request.getParameter("completed");

        try {
            int userHabitId = Integer.parseInt(habitIdStr);
            boolean isCompleted = Boolean.parseBoolean(completedStr);

            boolean success = habitService.toggleHabitCompletion(userHabitId, userId, isCompleted);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(String.format("{\"success\":%b,\"habitId\":%d,\"isCompleted\":%b}",
                    success, userHabitId, isCompleted));

        } catch (NumberFormatException | DatabaseException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
