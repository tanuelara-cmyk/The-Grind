package com.thegrind.servlet;

import com.thegrind.exception.DatabaseException;
import com.thegrind.exception.InvalidUserException;
import com.thegrind.model.User;
import com.thegrind.service.UserService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Class: RegisterServlet
 * Demonstrates:
 * - Servlet Lifecycle: init(), doPost(), destroy()
 * - HttpServletRequest and HttpServletResponse handling
 * - Form validation and custom exception catching
 * - Session initialization
 */
@WebServlet(name = "RegisterServlet", urlPatterns = {"/register"})
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private UserService userService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.userService = new UserService();
        System.out.println("[RegisterServlet] Initialized.");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/register.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String fullName = request.getParameter("fullName");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");

        try {
            // Call service layer for validation and hashing
            User registeredUser = userService.registerUser(fullName, email, password, confirmPassword);

            // Establish authenticated session
            HttpSession session = request.getSession(true);
            session.setAttribute("currentUser", registeredUser);
            session.setAttribute("userId", registeredUser.getId());
            session.setAttribute("userEmail", registeredUser.getEmail());
            session.setAttribute("userName", registeredUser.getFullName());

            // Redirect to onboarding workflow
            response.sendRedirect(request.getContextPath() + "/onboarding.jsp");

        } catch (InvalidUserException e) {
            request.setAttribute("errorMessage", e.getMessage());
            request.setAttribute("fullName", fullName);
            request.setAttribute("email", email);
            request.getRequestDispatcher("/register.jsp").forward(request, response);
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Database system error: " + e.getMessage());
            request.getRequestDispatcher("/register.jsp").forward(request, response);
        }
    }

    @Override
    public void destroy() {
        super.destroy();
        System.out.println("[RegisterServlet] Destroyed.");
    }
}
