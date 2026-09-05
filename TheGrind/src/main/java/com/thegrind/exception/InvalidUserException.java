package com.thegrind.exception;

/**
 * Custom Exception: InvalidUserException
 * Thrown when user inputs fail validation (empty names, invalid email format, short passwords).
 */
public class InvalidUserException extends TheGrindException {
    private static final long serialVersionUID = 1L;

    public InvalidUserException(String message) {
        super(message);
    }
}
