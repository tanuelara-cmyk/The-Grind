package com.thegrind.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Abstract Class: Person
 * Demonstrates:
 * - Abstraction (abstract class & abstract methods)
 * - Encapsulation (private fields, public getters and setters)
 * - Base class for inheritance hierarchy
 */
public abstract class Person implements Serializable {
    private static final long serialVersionUID = 1L;

    // Encapsulated state (private access modifiers)
    protected int id;
    protected String fullName;
    protected String email;
    protected Timestamp createdAt;

    // Static member tracking instance creation or platform standards
    public static final String APP_NAME = "THE GRIND";

    // Default constructor
    public Person() {
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }

    // Parameterized constructor
    public Person(int id, String fullName, String email) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }

    // Abstract method that derived classes MUST implement (Demonstrating Abstraction)
    public abstract String getRoleDescription();

    // Abstract method demonstrating message passing across OOP boundaries
    public abstract String getDisplayName();

    // Final method: cannot be overridden by subclasses (Demonstrates final keyword)
    public final String getIdentityHeader() {
        return "[" + APP_NAME + "] " + this.fullName + " <" + this.email + ">";
    }

    // Getters and Setters (Encapsulation)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    // Method overriding of Object.toString()
    @Override
    public String toString() {
        return "Person{id=" + id + ", fullName='" + fullName + "', email='" + email + "'}";
    }
}
