package com.thegrind.servlet;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.Progress;
import com.thegrind.model.User;
import com.thegrind.service.ProgressService;
import com.thegrind.service.UserService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Class: ProgressServlet
 * Controller for the dedicated Progress page.
 * Provides weekly day-by-day stats (Monday to Sunday) and streak calculations.
 */
@WebServlet(name = "ProgressServlet", urlPatterns = {"/progress"})
public class ProgressServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private ProgressService progressService;
    private UserService userService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.progressService = new ProgressService();
        this.userService = new UserService();
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
            Progress progress = progressService.getUserProgress(userId);

            request.setAttribute("user", user);
            request.setAttribute("progress", progress);
            request.getRequestDispatcher("/progress.jsp").forward(request, response);

        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Error calculating progress: " + e.getMessage());
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }
    }
}
