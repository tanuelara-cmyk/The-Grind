package com.thegrind.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;

/**
 * Class: PasswordUtil
 * Demonstrates secure password hashing using SHA-256 with salt.
 * Ensures passwords are not stored in plaintext in the database.
 */
public class PasswordUtil {

    private static final String SALT = "TheGrindHabitClub@2025#SaltKey!";

    /**
     * Hashes raw password using SHA-256 with static application salt.
     */
    public static String hashPassword(String rawPassword) {
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            return null;
        }
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(SALT.getBytes(StandardCharsets.UTF_8));
            byte[] hashedPassword = md.digest(rawPassword.getBytes(StandardCharsets.UTF_8));

            // Convert bytes to hex string
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedPassword) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Verifies raw password against the stored hash.
     */
    public static boolean verifyPassword(String rawPassword, String storedHash) {
        if (rawPassword == null || storedHash == null) {
            return false;
        }
        String calculatedHash = hashPassword(rawPassword);
        return calculatedHash != null && calculatedHash.equals(storedHash);
    }
}
