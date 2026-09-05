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
 * Class: DeleteHabitServlet
 * Handles habit deletion requests.
 */
@WebServlet(name = "DeleteHabitServlet", urlPatterns = {"/delete-habit"})
public class DeleteHabitServlet extends HttpServlet {
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
        String habitIdStr = request.getParameter("habitId");

        try {
            int userHabitId = Integer.parseInt(habitIdStr);
            habitService.deleteHabit(userHabitId, userId);
            response.sendRedirect(request.getContextPath() + "/dashboard");
        } catch (NumberFormatException | DatabaseException e) {
            response.sendRedirect(request.getContextPath() + "/dashboard?error=" + e.getMessage());
        }
    }
}
