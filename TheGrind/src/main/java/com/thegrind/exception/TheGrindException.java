package com.thegrind.exception;

/**
 * Base Custom Exception: TheGrindException
 * Root of the custom exception hierarchy for The Grind Habit Challenge Club.
 * Demonstrates User-defined exceptions in Java.
 */
public class TheGrindException extends Exception {
    private static final long serialVersionUID = 1L;

    public TheGrindException(String message) {
        super(message);
    }

    public TheGrindException(String message, Throwable cause) {
        super(message, cause);
    }
}
