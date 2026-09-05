package com.thegrind.util;

import com.thegrind.exception.InvalidHabitException;
import com.thegrind.exception.InvalidUserException;

import java.util.regex.Pattern;

/**
 * Class: ValidationUtil
 * Demonstrates:
 * - Method Overloading (multiple validateUser and validateHabit methods)
 * - Custom Exception throwing (throw keyword)
 * - Input validation logic
 */
public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    // Method Overloading 1: Basic email validation
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    // Method Overloading 2: User validation with 3 parameters
    public static void validateUser(String fullName, String email, String password) throws InvalidUserException {
        if (fullName == null || fullName.trim().length() < 2) {
            throw new InvalidUserException("Full Name must be at least 2 characters long.");
        }
        if (!isValidEmail(email)) {
            throw new InvalidUserException("Invalid email address format provided.");
        }
        if (password == null || password.trim().length() < 6) {
            throw new InvalidUserException("Password must contain at least 6 characters.");
        }
    }

    // Method Overloading 3: User validation with password confirmation check (4 parameters)
    public static void validateUser(String fullName, String email, String password, String confirmPassword)
            throws InvalidUserException {
        validateUser(fullName, email, password);
        if (!password.equals(confirmPassword)) {
            throw new InvalidUserException("Passwords do not match. Please verify.");
        }
    }

    // Method Overloading 4: Habit validation with 2 parameters
    public static void validateHabit(String habitName, int targetValue) throws InvalidHabitException {
        if (habitName == null || habitName.trim().isEmpty()) {
            throw new InvalidHabitException("Habit name cannot be blank.");
        }
        if (targetValue <= 0) {
            throw new InvalidHabitException("Target value must be greater than zero.");
        }
    }

    // Method Overloading 5: Habit validation with 3 parameters (including unit)
    public static void validateHabit(String habitName, int targetValue, String unit) throws InvalidHabitException {
        validateHabit(habitName, targetValue);
        if (unit == null || unit.trim().isEmpty()) {
            throw new InvalidHabitException("Habit unit must be specified (e.g. Liters, Mins, Pages).");
        }
    }
}
