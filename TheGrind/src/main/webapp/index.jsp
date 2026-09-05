<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE GRIND – Habit Challenge Club</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Header Navigation -->
    <header class="app-header">
        <div class="container nav-wrapper">
            <div class="brand-logo">
                <span style="font-size: 26px;">🌱</span>
                <span>THE GRIND</span>
                <span class="brand-badge">CLUB</span>
            </div>
            <nav>
                <div style="display: flex; gap: 12px;">
                    <a href="login.jsp" class="btn btn-outline btn-sm">Log In</a>
                    <a href="register.jsp" class="btn btn-primary btn-sm">Join The Club</a>
                </div>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <main class="container" style="padding-top: 60px; padding-bottom: 80px;">
        <div style="text-align: center; max-width: 720px; margin: 0 auto;">
            <div style="display: inline-flex; align-items: center; gap: 8px; background: var(--brand-light); color: var(--brand-primary); padding: 6px 16px; border-radius: 9999px; font-weight: 700; font-size: 13px; margin-bottom: 20px;">
                <span>✨</span> Built for Daily Consistency
            </div>
            <h1 style="font-size: 48px; letter-spacing: -1.5px; margin-bottom: 16px; color: var(--text-primary);">
                Small steps.<br><span style="color: var(--brand-primary);">Big changes.</span>
            </h1>
            <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 32px; line-height: 1.6;">
                Welcome to The Grind – a minimalist, evidence-based habit challenge club engineered to help you master discipline, track streaks, and transform your daily routines.
            </p>
            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                <a href="register.jsp" class="btn btn-primary" style="padding: 14px 32px; font-size: 16px;">
                    Start Your 30-Day Grind →
                </a>
                <a href="login.jsp" class="btn btn-outline" style="padding: 14px 28px; font-size: 16px;">
                    Member Sign In
                </a>
            </div>
        </div>

        <!-- 3 Pillars Feature Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 72px;">
            <div class="card">
                <div style="font-size: 32px; margin-bottom: 16px;">🎯</div>
                <h3 style="font-size: 20px; margin-bottom: 8px;">Personalized Goals</h3>
                <p style="color: var(--text-secondary); font-size: 15px;">
                    Whether reading 20 pages, drinking 2L of water, or hitting the gym, configure custom targets and gentle reminders.
                </p>
            </div>
            <div class="card">
                <div style="font-size: 32px; margin-bottom: 16px;">🔥</div>
                <h3 style="font-size: 20px; margin-bottom: 8px;">Streak Protection</h3>
                <p style="color: var(--text-secondary); font-size: 15px;">
                    Track continuous streaks, celebrate consistency milestones, and view weekly completion heatmaps without distractions.
                </p>
            </div>
            <div class="card">
                <div style="font-size: 32px; margin-bottom: 16px;">🤖</div>
                <h3 style="font-size: 20px; margin-bottom: 8px;">Grind Coach</h3>
                <p style="color: var(--text-secondary); font-size: 15px;">
                    Your dedicated AI & rule-based consistency companion. Provides mindset motivation and tells you exactly what to tackle next.
                </p>
            </div>
        </div>

        <!-- Live Demo Preview Card -->
        <div class="card" style="margin-top: 48px; background: linear-gradient(135deg, #FFFFFF 0%, var(--brand-light) 100%); border: 1.5px solid var(--brand-soft); text-align: center; padding: 40px 24px;">
            <h3 style="font-size: 24px; margin-bottom: 8px;">Ready to start your streak?</h3>
            <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 24px auto;">
                Sign up in 30 seconds, select your primary goals, and start ticking off wins today.
            </p>
            <a href="register.jsp" class="btn btn-primary">Create Free Account</a>
        </div>
    </main>

    <footer style="text-align: center; padding: 24px; border-top: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 13px;">
        &copy; 2025 THE GRIND – Habit Challenge Club. Full-Stack Java (Servlets, JSP, JDBC, MySQL, Multithreading, OOP).
    </footer>

</body>
</html>
