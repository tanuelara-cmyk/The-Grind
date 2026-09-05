package com.thegrind.servlet;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.Reminder;
import com.thegrind.model.User;
import com.thegrind.service.ReminderService;
import com.thegrind.service.UserService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Class: ProfileServlet
 * Controller for user profile details and application settings.
 */
@WebServlet(name = "ProfileServlet", urlPatterns = {"/profile", "/settings"})
public class ProfileServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private UserService userService;
    private ReminderService reminderService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.userService = new UserService();
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
        String uri = request.getRequestURI();

        try {
            User user = userService.getUserById(userId);
            Reminder reminder = reminderService.getReminderSettings(userId);

            request.setAttribute("user", user);
            request.setAttribute("reminder", reminder);

            if (uri.contains("/settings")) {
                request.getRequestDispatcher("/settings.jsp").forward(request, response);
            } else {
                request.getRequestDispatcher("/profile.jsp").forward(request, response);
            }
        } catch (DatabaseException e) {
            response.sendRedirect(request.getContextPath() + "/dashboard?error=" + e.getMessage());
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
        String fullName = request.getParameter("fullName");
        String avatarUrl = request.getParameter("avatarUrl");

        try {
            userService.updateProfile(userId, fullName, avatarUrl != null ? avatarUrl : "default_avatar.png");
            session.setAttribute("userName", fullName);
            response.sendRedirect(request.getContextPath() + "/profile?updated=true");
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Error updating profile: " + e.getMessage());
            request.getRequestDispatcher("/profile.jsp").forward(request, response);
        }
    }
}
