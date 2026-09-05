package com.thegrind.service;

import java.sql.Timestamp;

/**
 * Abstract Class: AbstractService
 * Demonstrates:
 * - Abstraction in service layer
 * - Template method pattern
 * - Final methods for security and audit logging
 */
public abstract class AbstractService {

    // Final variable: Immutable service tier identifier
    protected final String serviceIdentifier;

    public AbstractService(String serviceIdentifier) {
        this.serviceIdentifier = serviceIdentifier;
    }

    // Abstract method: Every service must define its health/readiness check
    public abstract boolean isOperational();

    // Final template method: Cannot be overridden (Demonstrates final keyword)
    public final void logAction(String action, int userId) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        System.out.println("[" + now + "] [" + serviceIdentifier + "] Action: " + action + " for User ID: " + userId);
    }

    public String getServiceIdentifier() {
        return serviceIdentifier;
    }
}
