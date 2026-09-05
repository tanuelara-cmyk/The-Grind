<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${habit != null ? habit.habitName : 'Habit Details'} – THE GRIND</title>
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
                <li><a href="reminders">Reminders</a></li>
            </ul>
            <div>
                <a href="dashboard" class="btn btn-outline btn-sm">← Back to Dashboard</a>
            </div>
        </div>
    </header>

    <main class="container" style="max-width: 680px; padding-top: 40px; padding-bottom: 60px;">
        <c:choose>
            <c:when test="${not empty habit}">
                <div class="card" style="padding: 36px 32px; margin-bottom: 24px;">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
                        <div style="width: 64px; height: 64px; border-radius: var(--radius-md); background: var(--brand-light); display: flex; align-items: center; justify-content: center; font-size: 32px;">
                            <c:out value="${habit.icon != null ? habit.icon : '⚡'}"/>
                        </div>
                        <div>
                            <div style="font-size: 13px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase;">
                                <c:out value="${habit.category}"/>
                            </div>
                            <h1 style="font-size: 28px; line-height: 1.2;">
                                <c:out value="${habit.habitName}"/>
                            </h1>
                        </div>
                    </div>

                    <p style="color: var(--text-secondary); font-size: 15px; margin-bottom: 28px; line-height: 1.6;">
                        <c:out value="${not empty habit.description ? habit.description : 'Building daily repetition for this habit builds lasting neural pathways and discipline.'}"/>
                    </p>

                    <!-- Details Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
                        <div class="stat-box" style="padding: 16px;">
                            <div>
                                <div class="stat-value" style="font-size: 20px;">
                                    <c:out value="${habit.targetValue}"/> <c:out value="${habit.unit}"/>
                                </div>
                                <div class="stat-label">Daily Target</div>
                            </div>
                        </div>

                        <div class="stat-box" style="padding: 16px;">
                            <div>
                                <div class="stat-value" style="font-size: 20px;">
                                    <c:out value="${not empty habit.reminderTime ? habit.reminderTime : '08:00 PM'}"/>
                                </div>
                                <div class="stat-label">Daily Reminder</div>
                            </div>
                        </div>
                    </div>

                    <!-- 7-Day History Visualization -->
                    <div style="margin-bottom: 32px;">
                        <h4 style="font-size: 15px; margin-bottom: 12px;">7-Day History</h4>
                        <div style="display: flex; justify-content: space-between; gap: 8px;">
                            <div style="text-align: center; flex: 1;">
                                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">Mon</div>
                                <div style="height: 36px; border-radius: var(--radius-sm); background: var(--brand-light); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-weight: 700;">✓</div>
                            </div>
                            <div style="text-align: center; flex: 1;">
                                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">Tue</div>
                                <div style="height: 36px; border-radius: var(--radius-sm); background: var(--brand-light); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-weight: 700;">✓</div>
                            </div>
                            <div style="text-align: center; flex: 1;">
                                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">Wed</div>
                                <div style="height: 36px; border-radius: var(--radius-sm); background: var(--brand-light); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-weight: 700;">✓</div>
                            </div>
                            <div style="text-align: center; flex: 1;">
                                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">Thu</div>
                                <div style="height: 36px; border-radius: var(--radius-sm); background: var(--brand-light); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-weight: 700;">✓</div>
                            </div>
                            <div style="text-align: center; flex: 1;">
                                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">Fri</div>
                                <div style="height: 36px; border-radius: var(--radius-sm); background: var(--brand-light); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-weight: 700;">✓</div>
                            </div>
                            <div style="text-align: center; flex: 1;">
                                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">Sat</div>
                                <div style="height: 36px; border-radius: var(--radius-sm); background: var(--brand-light); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-weight: 700;">✓</div>
                            </div>
                            <div style="text-align: center; flex: 1;">
                                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">Today</div>
                                <div style="height: 36px; border-radius: var(--radius-sm); background: var(--brand-primary); color: #FFF; display: flex; align-items: center; justify-content: center; font-weight: 700;">★</div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 24px;">
                        <form action="delete-habit" method="POST" onsubmit="return confirm('Are you sure you want to delete this habit?');">
                            <input type="hidden" name="habitId" value="${habit.userHabitId}">
                            <button type="submit" class="btn btn-outline btn-sm" style="color: #C62828; border-color: #FFCDD2;">
                                🗑️ Delete Habit
                            </button>
                        </form>

                        <a href="dashboard" class="btn btn-primary btn-sm">Done Viewing</a>
                    </div>
                </div>
            </c:when>
            <c:otherwise>
                <div class="card" style="text-align: center; padding: 48px;">
                    <h2>Habit not found</h2>
                    <p style="color: var(--text-secondary); margin: 16px 0;">This habit may have been removed.</p>
                    <a href="dashboard" class="btn btn-primary">Return to Dashboard</a>
                </div>
            </c:otherwise>
        </c:choose>
    </main>

</body>
</html>
