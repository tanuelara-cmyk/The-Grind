package com.thegrind.interfaces;

/**
 * Interface: Authenticatable
 * Demonstrates Abstraction and Interface definition for entities
 * that can perform credential verification and authentication.
 */
public interface Authenticatable {
    boolean authenticate(String rawPassword);
    String getEmail();
    String getPasswordHash();
}
