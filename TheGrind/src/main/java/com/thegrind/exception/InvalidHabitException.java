package com.thegrind.exception;

/**
 * Custom Exception: InvalidHabitException
 * Thrown when habit attributes are invalid (negative targets, empty name, bad units).
 */
public class InvalidHabitException extends TheGrindException {
    private static final long serialVersionUID = 1L;

    public InvalidHabitException(String message) {
        super(message);
    }
}
