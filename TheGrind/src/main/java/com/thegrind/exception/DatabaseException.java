package com.thegrind.exception;

/**
 * Custom Exception: DatabaseException
 * Wraps low-level JDBC SQLExceptions into domain-friendly exceptions.
 */
public class DatabaseException extends TheGrindException {
    private static final long serialVersionUID = 1L;

    public DatabaseException(String message) {
        super(message);
    }

    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
