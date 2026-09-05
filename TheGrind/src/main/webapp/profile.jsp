<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile – THE GRIND</title>
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
                <li><a href="settings">Settings</a></li>
            </ul>
            <div>
                <a href="dashboard" class="btn btn-outline btn-sm">← Back to Dashboard</a>
            </div>
        </div>
    </header>

    <main class="container" style="max-width: 640px; padding-top: 40px; padding-bottom: 60px;">

        <c:if test="${param.updated == 'true'}">
            <div class="alert alert-success">
                Profile details updated successfully!
            </div>
        </c:if>

        <div class="card" style="padding: 36px 32px; margin-bottom: 24px;">
            <!-- Profile Top Header -->
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
                <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--brand-light); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; border: 3px solid var(--brand-soft);">
                    ${user != null ? user.fullName.substring(0, 1) : 'U'}
                </div>
                <div>
                    <h1 style="font-size: 26px; line-height: 1.2;">
                        <c:out value="${user != null ? user.fullName : 'Grinder'}"/>
                    </h1>
                    <div style="color: var(--text-secondary); font-size: 14px;">
                        <c:out value="${user != null ? user.email : 'user@thegrind.club'}"/>
                    </div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                        Member of The Grind Club
                    </div>
                </div>
            </div>

            <!-- Stats Highlight Bar -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 32px;">
                <div class="stat-box" style="padding: 12px; justify-content: center; text-align: center;">
                    <div>
                        <div class="stat-value" style="font-size: 20px;">${user != null ? user.currentStreak : 7}</div>
                        <div class="stat-label">Streak</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 12px; justify-content: center; text-align: center;">
                    <div>
                        <div class="stat-value" style="font-size: 20px;">${user != null ? user.bestStreak : 14}</div>
                        <div class="stat-label">Best</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 12px; justify-content: center; text-align: center;">
                    <div>
                        <div class="stat-value" style="font-size: 20px;">${user != null ? user.totalCompleted : 42}</div>
                        <div class="stat-label">Completions</div>
                    </div>
                </div>
            </div>

            <!-- Focus Goals -->
            <div style="margin-bottom: 32px;">
                <h3 style="font-size: 16px; margin-bottom: 12px;">Active Goals</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    <c:choose>
                        <c:when test="${not empty user.goals}">
                            <c:forEach var="g" items="${user.goals}">
                                <span style="background: var(--brand-light); color: var(--brand-primary); font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: var(--radius-full);">
                                    🎯 <c:out value="${g}"/>
                                </span>
                            </c:forEach>
                        </c:when>
                        <c:otherwise>
                            <span style="background: var(--brand-light); color: var(--brand-primary); font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: var(--radius-full);">
                                🔥 Build Consistency
                            </span>
                            <span style="background: var(--brand-light); color: var(--brand-primary); font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: var(--radius-full);">
                                📚 Read More
                            </span>
                            <span style="background: var(--brand-light); color: var(--brand-primary); font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: var(--radius-full);">
                                💪 Improve Fitness
                            </span>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>

            <!-- Edit Details Form -->
            <h3 style="font-size: 16px; margin-bottom: 16px; border-top: 1px solid var(--border-subtle); padding-top: 24px;">
                Update Profile Information
            </h3>
            <form action="profile" method="POST">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" name="fullName" class="form-input" value="${user != null ? user.fullName : ''}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Email (Account ID)</label>
                    <input type="email" class="form-input" value="${user != null ? user.email : ''}" disabled style="background: var(--bg-surface-subtle);">
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    Save Profile Changes
                </button>
            </form>
        </div>
    </main>

</body>
</html>
