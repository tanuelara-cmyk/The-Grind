package com.thegrind.service;

import com.thegrind.dao.GoalDAO;
import com.thegrind.dao.UserDAO;
import com.thegrind.exception.AuthenticationException;
import com.thegrind.exception.DatabaseException;
import com.thegrind.exception.InvalidUserException;
import com.thegrind.model.User;
import com.thegrind.util.PasswordUtil;
import com.thegrind.util.ValidationUtil;

import java.util.List;

/**
 * Class: UserService
 * Extends AbstractService (Inheritance).
 * Implements user registration, authentication, and profile workflows.
 * Demonstrates:
 * - Exception handling with try, catch, finally, throw, throws
 * - Validation with custom exceptions
 * - Secure password hashing
 */
public class UserService extends AbstractService {

    private final UserDAO userDAO;
    private final GoalDAO goalDAO;

    public UserService() {
        super("UserService");
        this.userDAO = new UserDAO();
        this.goalDAO = new GoalDAO();
    }

    @Override
    public boolean isOperational() {
        return userDAO != null;
    }

    /**
     * Registers a new user.
     * Demonstrates multiple try/catch blocks and custom exception throws.
     */
    public User registerUser(String fullName, String email, String password, String confirmPassword)
            throws InvalidUserException, DatabaseException {

        // 1. Validation with Custom Exception
        ValidationUtil.validateUser(fullName, email, password, confirmPassword);

        // 2. Check for duplicate email
        try {
            User existing = userDAO.findByEmail(email.trim().toLowerCase());
            if (existing != null) {
                throw new InvalidUserException("An account with email '" + email + "' already exists. Please log in.");
            }
        } catch (DatabaseException e) {
            throw e;
        }

        // 3. Hash password securely
        String hashedPassword = PasswordUtil.hashPassword(password);

        // 4. Create User entity
        User newUser = new User(fullName.trim(), email.trim().toLowerCase(), hashedPassword);

        try {
            User registered = userDAO.registerUser(newUser);
            logAction("USER_REGISTERED", registered.getId());
            return registered;
        } catch (DatabaseException e) {
            throw new DatabaseException("Registration failed due to a database error: " + e.getMessage(), e);
        }
    }

    /**
     * Authenticates a user by email and password.
     */
    public User authenticateUser(String email, String rawPassword)
            throws AuthenticationException, DatabaseException {

        if (email == null || rawPassword == null || email.trim().isEmpty() || rawPassword.trim().isEmpty()) {
            throw new AuthenticationException("Email and password cannot be empty.");
        }

        User user = null;
        try {
            user = userDAO.findByEmail(email.trim().toLowerCase());
        } catch (DatabaseException e) {
            throw new DatabaseException("Database error during authentication: " + e.getMessage(), e);
        }

        if (user == null) {
            throw new AuthenticationException("Invalid email or password. Please check your credentials.");
        }

        // Call user.authenticate (Encapsulation and Authenticatable interface)
        if (!user.authenticate(rawPassword)) {
            throw new AuthenticationException("Invalid email or password. Please check your credentials.");
        }

        // Populate user goals
        try {
            List<String> goals = goalDAO.getUserGoals(user.getId());
            user.setGoals(goals);
        } catch (DatabaseException ignored) {}

        logAction("USER_LOGGED_IN", user.getId());
        return user;
    }

    public User getUserById(int userId) throws DatabaseException {
        User user = userDAO.findById(userId);
        if (user != null) {
            List<String> goals = goalDAO.getUserGoals(userId);
            user.setGoals(goals);
        }
        return user;
    }

    public boolean updateProfile(int userId, String fullName, String avatarUrl) throws DatabaseException {
        boolean success = userDAO.updateProfile(userId, fullName, avatarUrl);
        if (success) {
            logAction("PROFILE_UPDATED", userId);
        }
        return success;
    }

    public boolean saveUserGoals(int userId, List<String> goals) throws DatabaseException {
        return goalDAO.saveGoals(userId, goals);
    }
}
