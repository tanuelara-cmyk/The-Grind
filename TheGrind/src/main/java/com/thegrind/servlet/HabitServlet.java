package com.thegrind.servlet;

import com.thegrind.exception.DatabaseException;
import com.thegrind.model.Habit;
import com.thegrind.service.HabitService;
import com.thegrind.util.DateUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import java.util.Vector;

/**
 * Class: HabitServlet
 * Handles habit selection page and single habit details view.
 */
@WebServlet(name = "HabitServlet", urlPatterns = {"/habits", "/habit-details"})
public class HabitServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private HabitService habitService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.habitService = new HabitService();
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
            if (uri.contains("/habit-details")) {
                String idParam = request.getParameter("id");
                if (idParam != null) {
                    int habitId = Integer.parseInt(idParam);
                    Habit habit = habitService.getHabitDetails(habitId);
                    request.setAttribute("habit", habit);
                    request.getRequestDispatcher("/habit-details.jsp").forward(request, response);
                    return;
                }
            }

            // Catalog view (for selecting habits)
            List<Habit> catalog = habitService.getMasterHabitsCatalog();
            Vector<Habit> userHabits = habitService.getUserHabitsVector(userId, DateUtil.getTodaySqlDate());

            request.setAttribute("catalog", catalog);
            request.setAttribute("userHabits", userHabits);
            request.getRequestDispatcher("/select-habits.jsp").forward(request, response);

        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Error loading habits: " + e.getMessage());
            request.getRequestDispatcher("/dashboard").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
