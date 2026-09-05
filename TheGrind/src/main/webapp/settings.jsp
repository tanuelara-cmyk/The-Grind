<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings – THE GRIND</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Header Navigation -->
    <header class="app-header">
        <div class="container nav-wrapper">
            <a href="dashboard" class="brand-logo">
                <span style="font-size: 26px;">🌱</span>
                <span>THE GRIND</span>
            </a>
            <ul class="nav-links">
                <li><a href="dashboard">Dashboard</a></li>
                <li><a href="progress">Progress</a></li>
                <li><a href="profile">Profile</a></li>
            </ul>
            <div>
                <a href="dashboard" class="btn btn-outline btn-sm">← Back to Dashboard</a>
            </div>
        </div>
    </header>

    <main class="container" style="max-width: 640px; padding-top: 40px; padding-bottom: 60px;">

        <c:if test="${param.updated == 'true'}">
            <div class="alert alert-success">
                Settings updated successfully!
            </div>
        </c:if>

        <h1 style="font-size: 30px; margin-bottom: 24px;">Application Settings</h1>

        <!-- Reminders Card -->
        <div class="card" style="padding: 28px; margin-bottom: 24px;">
            <h3 style="font-size: 18px; margin-bottom: 8px;">⏰ Reminder Preferences</h3>
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">
                Manage the schedule for your daily habit check-ins.
            </p>

            <form action="reminders" method="POST">
                <div class="form-group">
                    <label class="form-label">Daily Reminder Time</label>
                    <input type="text" name="reminderTime" class="form-input" value="${reminder != null ? reminder.reminderTime : '08:00 AM'}">
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <div style="font-weight: 600; font-size: 14px;">Enable In-App Notifications</div>
                        <div style="font-size: 12px; color: var(--text-muted);">Background multithreaded scheduler alerts</div>
                    </div>
                    <input type="checkbox" name="enabled" value="true" checked style="width: 20px; height: 20px; accent-color: var(--brand-primary);">
                </div>

                <button type="submit" class="btn btn-outline btn-sm">Save Reminder Settings</button>
            </form>
        </div>

        <!-- Session & Account Actions -->
        <div class="card" style="padding: 28px;">
            <h3 style="font-size: 18px; margin-bottom: 8px;">🔐 Account & Security</h3>
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">
                Secure session management, password encryption (SHA-256), and sign out.
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: var(--text-secondary);">End active session on this device:</span>
                <a href="logout" class="btn btn-outline btn-sm" style="color: #C62828; border-color: #FFCDD2;">
                    Sign Out of The Grind
                </a>
            </div>
        </div>

    </main>

</body>
</html>
