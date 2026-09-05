package com.thegrind.servlet;

import com.thegrind.exception.DatabaseException;
import com.thegrind.exception.InvalidHabitException;
import com.thegrind.service.HabitService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Class: AddHabitServlet
 * Handles custom habit creation.
 * Demonstrates:
 * - Handling form submissions and AJAX requests
 * - Catching custom InvalidHabitException
 * - Defensive parameter parsing
 */
@WebServlet(name = "AddHabitServlet", urlPatterns = {"/add-habit"})
public class AddHabitServlet extends HttpServlet {
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
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        int userId = (Integer) session.getAttribute("userId");
        String habitName = request.getParameter("habitName");
        String description = request.getParameter("description");
        String targetStr = request.getParameter("target");
        String unit = request.getParameter("unit");
        String frequency = request.getParameter("frequency");
        String reminderTime = request.getParameter("reminderTime");
        String icon = request.getParameter("icon");

        int targetValue = 1;
        try {
            if (targetStr != null && !targetStr.trim().isEmpty()) {
                targetValue = Integer.parseInt(targetStr.trim());
            }
        } catch (NumberFormatException e) {
            targetValue = -1; // Trigger validation exception
        }

        try {
            habitService.addCustomHabit(userId, habitName, description, targetValue, unit, frequency, icon, reminderTime);

            String isAjax = request.getHeader("X-Requested-With");
            if ("XMLHttpRequest".equalsIgnoreCase(isAjax)) {
                response.setContentType("application/json");
                response.getWriter().write("{\"success\":true,\"message\":\"Habit added successfully!\"}");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard");
            }

        } catch (InvalidHabitException e) {
            String isAjax = request.getHeader("X-Requested-With");
            if ("XMLHttpRequest".equalsIgnoreCase(isAjax)) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType("application/json");
                response.getWriter().write("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
            } else {
                request.setAttribute("errorMessage", e.getMessage());
                request.getRequestDispatcher("/select-habits.jsp").forward(request, response);
            }
        } catch (DatabaseException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            request.setAttribute("errorMessage", "Database error: " + e.getMessage());
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }
    }
}
