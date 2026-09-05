package com.thegrind.servlet;

import com.thegrind.exception.DatabaseException;
import com.thegrind.service.UserService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Class: GoalServlet
 * Handles onboarding goal selection workflow.
 */
@WebServlet(name = "GoalServlet", urlPatterns = {"/goals"})
public class GoalServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private UserService userService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.userService = new UserService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/onboarding.jsp").forward(request, response);
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
        String[] selectedGoals = request.getParameterValues("goals");

        if (selectedGoals != null && selectedGoals.length > 0) {
            List<String> goalList = Arrays.asList(selectedGoals);
            try {
                userService.saveUserGoals(userId, goalList);
            } catch (DatabaseException e) {
                System.err.println("Error saving goals: " + e.getMessage());
            }
        }

        // Proceed to next onboarding step: Select Habits
        response.sendRedirect(request.getContextPath() + "/select-habits.jsp");
    }
}
