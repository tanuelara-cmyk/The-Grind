package com.thegrind.exception;

/**
 * Custom Exception: AuthenticationException
 * Thrown when credentials fail or unauthorized access is detected.
 */
public class AuthenticationException extends TheGrindException {
    private static final long serialVersionUID = 1L;

    public AuthenticationException(String message) {
        super(message);
    }
}
