package com.thegrind.filter;

import com.thegrind.model.User;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Class: AuthenticationFilter
 * Implements Servlet Filter for session-based authentication guarding.
 * Demonstrates:
 * - Session Management and security enforcement
 * - Intercepting requests before reaching Servlets/JSP pages
 */
public class AuthenticationFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("[AuthenticationFilter] Filter initialized.");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestUri = httpRequest.getRequestURI();
        HttpSession session = httpRequest.getSession(false);

        boolean isLoggedIn = (session != null && session.getAttribute("currentUser") != null);

        // Allow public static resources and auth endpoints
        boolean isPublicResource = requestUri.endsWith("index.jsp") ||
                                   requestUri.endsWith("login.jsp") ||
                                   requestUri.endsWith("register.jsp") ||
                                   requestUri.contains("/login") ||
                                   requestUri.contains("/register") ||
                                   requestUri.contains("/css/") ||
                                   requestUri.contains("/js/") ||
                                   requestUri.contains("/images/");

        if (isLoggedIn || isPublicResource) {
            // User authenticated or resource is public -> continue chain
            chain.doFilter(request, response);
        } else {
            // Protected resource requested without session -> redirect to login
            System.out.println("[AuthenticationFilter] Unauthorized access blocked for: " + requestUri);
            if (requestUri.contains("/api/")) {
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"success\":false,\"message\":\"Session expired. Please log in.\"}");
            } else {
                httpResponse.sendRedirect(httpRequest.getContextPath() + "/login.jsp?error=unauthorized");
            }
        }
    }

    @Override
    public void destroy() {
        System.out.println("[AuthenticationFilter] Filter destroyed.");
    }
}
