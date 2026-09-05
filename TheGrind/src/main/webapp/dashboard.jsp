<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard – THE GRIND</title>
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
                <li><a href="dashboard" class="active">Dashboard</a></li>
                <li><a href="progress">Progress</a></li>
                <li><a href="select-habits.jsp">Habits Catalog</a></li>
                <li><a href="reminders">Reminders</a></li>
            </ul>

            <div class="user-nav-profile">
                <!-- Notification Bell -->
                <a href="reminders" title="Reminders & Notifications" style="position: relative; font-size: 20px; color: var(--text-secondary); margin-right: 4px;">
                    🔔
                    <c:if test="${not empty notifications}">
                        <span style="position: absolute; top: -4px; right: -4px; width: 8px; height: 8px; background: #E53935; border-radius: 50%;"></span>
                    </c:if>
                </a>

                <a href="profile" style="display: flex; align-items: center; gap: 10px;">
                    <div class="avatar-circle">
                        ${user != null ? user.fullName.substring(0, 1) : 'U'}
                    </div>
                </a>

                <a href="logout" class="btn btn-outline btn-sm" style="padding: 6px 12px; font-size: 12px;">Sign Out</a>
            </div>
        </div>
    </header>

    <main class="container" style="padding-top: 32px; padding-bottom: 80px;">

        <!-- Greeting Bar -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
            <div>
                <h1 style="font-size: 32px; margin-bottom: 4px;">
                    Good day, <c:out value="${user != null ? user.fullName : 'Grinder'}"/>! 👋
                </h1>
                <p style="color: var(--text-secondary); font-size: 15px;">
                    Today is <span style="font-weight: 600; color: var(--text-primary);"><c:out value="${todayDateFormatted}"/></span> &bull; 
                    Focus on consistency over perfection.
                </p>
            </div>
            <div style="display: flex; gap: 12px;">
                <a href="select-habits.jsp" class="btn btn-secondary btn-sm">+ Add Habit</a>
                <a href="progress" class="btn btn-outline btn-sm">📊 Full Progress</a>
            </div>
        </div>

        <!-- Top Metrics Bar -->
        <div class="stats-bar">
            <!-- Streak Stat -->
            <div class="stat-box">
                <div class="stat-icon" style="background: #FFF3E0; color: #E65100;">🔥</div>
                <div>
                    <div class="stat-value"><c:out value="${user != null ? user.currentStreak : 7}"/> Days</div>
                    <div class="stat-label">Current Streak</div>
                </div>
            </div>

            <!-- Today's Completion Stat -->
            <div class="stat-box">
                <div class="stat-icon">✅</div>
                <div>
                    <div class="stat-value">
                        <span id="completedCountDisplay"><c:out value="${completedCount}"/></span> / 
                        <span id="totalCountDisplay"><c:out value="${totalHabits}"/></span>
                    </div>
                    <div class="stat-label">Completed Today</div>
                </div>
            </div>

            <!-- Best Streak Stat -->
            <div class="stat-box">
                <div class="stat-icon" style="background: #E8EAF6; color: #3949AB;">🏆</div>
                <div>
                    <div class="stat-value"><c:out value="${user != null ? user.bestStreak : 14}"/> Days</div>
                    <div class="stat-label">Personal Best</div>
                </div>
            </div>

            <!-- All-time Completions -->
            <div class="stat-box">
                <div class="stat-icon" style="background: #F3E5F5; color: #8E24AA;">⚡</div>
                <div>
                    <div class="stat-value"><c:out value="${user != null ? user.totalCompleted : 42}"/></div>
                    <div class="stat-label">Total Completed</div>
                </div>
            </div>
        </div>

        <!-- Main Dashboard 2-Column Grid -->
        <div class="dashboard-grid">

            <!-- Left Column: Today's Habit List -->
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h2 style="font-size: 20px;">Today's Habits Stack</h2>
                    <span style="font-size: 13px; color: var(--text-muted);">
                        Click checkbox to complete &bull; Click name for details
                    </span>
                </div>

                <div class="habit-list">
                    <c:choose>
                        <c:when test="${not empty habits}">
                            <c:forEach var="h" items="${habits}">
                                <div class="habit-item ${h.completedToday ? 'completed' : ''}" id="habit-row-${h.userHabitId}">
                                    <div class="habit-left">
                                        <div class="habit-icon">
                                            <c:out value="${h.icon != null ? h.icon : '🌱'}"/>
                                        </div>
                                        <div>
                                            <a href="habit-details?id=${h.userHabitId}" class="habit-name" style="display: block;">
                                                <c:out value="${h.habitName}"/>
                                            </a>
                                            <div class="habit-meta">
                                                <c:out value="${h.category}"/> &bull; Target: <c:out value="${h.targetValue}"/> <c:out value="${h.unit}"/>
                                                <c:if test="${not empty h.reminderTime}">
                                                    &bull; ⏰ <c:out value="${h.reminderTime}"/>
                                                </c:if>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Interactive Checkbox Button -->
                                    <button type="button" 
                                            class="habit-check-btn ${h.completedToday ? 'checked' : ''}" 
                                            data-habit-id="${h.userHabitId}"
                                            title="Toggle completion">
                                        <c:if test="${h.completedToday}">✓</c:if>
                                    </button>
                                </div>
                            </c:forEach>
                        </c:when>
                        <c:otherwise>
                            <div class="card" style="text-align: center; padding: 48px 20px;">
                                <div style="font-size: 36px; margin-bottom: 12px;">🌱</div>
                                <h3 style="font-size: 18px; margin-bottom: 6px;">No habits configured yet</h3>
                                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">
                                    Add your first daily habit to start building your streak!
                                </p>
                                <a href="select-habits.jsp" class="btn btn-primary btn-sm">+ Add Habits</a>
                            </div>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>

            <!-- Right Column: Today's Completion Card & Coach Tips -->
            <div style="display: flex; flex-direction: column; gap: 24px;">

                <!-- Progress Ring / Percentage Card -->
                <div class="card">
                    <h3 style="font-size: 18px; margin-bottom: 16px;">Daily Completion</h3>
                    
                    <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px;">
                        <span id="completionPctDisplay" style="font-size: 36px; font-weight: 800; color: var(--brand-primary);">
                            ${completionPercentage}%
                        </span>
                        <span style="color: var(--text-muted); font-size: 14px;">of today's targets reached</span>
                    </div>

                    <div class="progress-bar-container" style="margin-bottom: 20px;">
                        <div id="progressBarFill" class="progress-bar-fill" style="width: ${completionPercentage}%;"></div>
                    </div>

                    <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                        Consistency is formed when you show up daily, even for 5 minutes. Protect your streak!
                    </p>
                </div>

                <!-- Daily Motivational Quote -->
                <div class="card" style="background: var(--brand-light); border-color: var(--brand-soft);">
                    <div style="display: flex; align-items: center; gap: 8px; color: var(--brand-primary); font-weight: 700; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">
                        <span>💡</span> Grind Philosophy
                    </div>
                    <blockquote style="font-size: 15px; font-style: italic; color: var(--text-primary); margin-bottom: 8px; line-height: 1.5;">
                        "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                    </blockquote>
                    <div style="font-size: 13px; font-weight: 600; color: var(--text-secondary); text-align: right;">
                        — Will Durant
                    </div>
                </div>

                <!-- Quick Reminder Preview -->
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="font-size: 15px;">Daily Reminder</h4>
                        <a href="reminders" style="font-size: 13px; font-weight: 600;">Edit</a>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 24px;">⏰</span>
                        <div>
                            <div style="font-weight: 700; font-size: 15px;">08:00 AM Every Day</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Active in-app check-in notifications</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </main>

    <!-- Floating Grind Coach Chatbot Trigger Button -->
    <button type="button" class="chat-fab" id="chatFab" title="Chat with Grind Coach">
        💬
    </button>

    <!-- Grind Coach Chat Drawer -->
    <div class="chat-drawer" id="chatDrawer" style="display: none;">
        <div class="chat-header">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">🤖</span>
                <div>
                    <div style="font-weight: 700; font-size: 15px;">Grind Coach</div>
                    <div style="font-size: 11px; opacity: 0.85;">Habit Consistency Companion</div>
                </div>
            </div>
            <button type="button" id="closeChatBtn" style="background: none; border: none; color: #FFFFFF; font-size: 20px; cursor: pointer;">
                ✕
            </button>
        </div>

        <div class="chat-messages" id="chatMessages">
            <div class="chat-bubble coach">
                Hey <c:out value="${user != null ? user.fullName : 'there'}"/>! I'm your Grind Coach. How can I help you stay on track today?
            </div>
        </div>

        <!-- Suggestion Chips -->
        <div class="chat-suggestions" id="chatSuggestions">
            <button type="button" class="suggestion-pill">What should I focus on today?</button>
            <button type="button" class="suggestion-pill">Give me some motivation</button>
            <button type="button" class="suggestion-pill">How am I doing?</button>
            <button type="button" class="suggestion-pill">I missed my habit today</button>
        </div>

        <div class="chat-input-row">
            <input type="text" id="chatInput" class="form-input" placeholder="Ask Grind Coach..." style="padding: 10px 14px; font-size: 14px;">
            <button type="button" id="sendChatBtn" class="btn btn-primary btn-sm" style="padding: 10px 16px;">
                Send
            </button>
        </div>
    </div>

    <script src="js/main.js"></script>
    <script src="js/chatbot.js"></script>
</body>
</html>
