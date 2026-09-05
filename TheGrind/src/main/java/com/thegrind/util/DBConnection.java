package com.thegrind.util;

import com.thegrind.exception.DatabaseException;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Class: DBConnection
 * Demonstrates:
 * - Singleton Pattern for JDBC Connection Management
 * - JDBC Driver registration & Connection initialization
 * - Exception handling: try, catch, finally, throws
 * - PreparedStatement and ResultSet management
 * - Static members and methods
 */
public class DBConnection {

    // Static singleton instance
    private static DBConnection instance;

    // Database configuration variables
    private static String url;
    private static String username;
    private static String password;
    private static String driver;

    // Static initialization block
    static {
        try {
            Properties props = new Properties();
            InputStream in = DBConnection.class.getClassLoader().getResourceAsStream("db.properties");
            if (in != null) {
                props.load(in);
                driver = props.getProperty("jdbc.driver", "com.mysql.cj.jdbc.Driver");
                url = props.getProperty("jdbc.url", "jdbc:mysql://localhost:3306/the_grind?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
                username = props.getProperty("jdbc.username", "root");
                password = props.getProperty("jdbc.password", "root");
            } else {
                // Fallback defaults
                driver = "com.mysql.cj.jdbc.Driver";
                url = "jdbc:mysql://localhost:3306/the_grind?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
                username = "root";
                password = "root";
            }
            Class.forName(driver);
            System.out.println("[DBConnection] MySQL JDBC Driver successfully loaded: " + driver);
        } catch (Exception e) {
            System.err.println("[DBConnection] Error loading JDBC Driver: " + e.getMessage());
        }
    }

    // Private constructor (Singleton)
    private DBConnection() {}

    /**
     * Get Singleton instance of DBConnection
     */
    public static synchronized DBConnection getInstance() {
        if (instance == null) {
            instance = new DBConnection();
        }
        return instance;
    }

    /**
     * Establishes and returns a fresh JDBC Connection.
     * Demonstrates 'throws' clause with custom DatabaseException.
     */
    public Connection getConnection() throws DatabaseException {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, username, password);
            return conn;
        } catch (SQLException e) {
            // Multiple catch / wrapping into user-defined exception
            throw new DatabaseException("Failed to connect to MySQL database at: " + url + ". Details: " + e.getMessage(), e);
        }
    }

    /**
     * Safely closes JDBC resources.
     * Demonstrates finally block pattern and null checking.
     */
    public static void closeResources(ResultSet rs, PreparedStatement pstmt, Connection conn) {
        try {
            if (rs != null) {
                rs.close();
            }
        } catch (SQLException e) {
            System.err.println("[DBConnection] Error closing ResultSet: " + e.getMessage());
        } finally {
            try {
                if (pstmt != null) {
                    pstmt.close();
                }
            } catch (SQLException e) {
                System.err.println("[DBConnection] Error closing PreparedStatement: " + e.getMessage());
            } finally {
                try {
                    if (conn != null && !conn.isClosed()) {
                        conn.close();
                    }
                } catch (SQLException e) {
                    System.err.println("[DBConnection] Error closing Connection: " + e.getMessage());
                }
            }
        }
    }
}
