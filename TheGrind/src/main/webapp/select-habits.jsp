<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select Your Habits – THE GRIND</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Header Navigation -->
    <header class="app-header">
        <div class="container nav-wrapper">
            <div class="brand-logo">
                <span style="font-size: 26px;">🌱</span>
                <span>THE GRIND</span>
            </div>
            <div style="font-size: 13px; font-weight: 600; color: var(--text-muted);">
                Step 2 of 3: Build Your Stack
            </div>
        </div>
    </header>

    <main class="container" style="max-width: 780px; padding-top: 40px; padding-bottom: 60px;">
        <div style="text-align: center; margin-bottom: 36px;">
            <div style="font-size: 40px; margin-bottom: 12px;">⚡</div>
            <h1 style="font-size: 32px; margin-bottom: 8px;">Select your daily habits</h1>
            <p style="color: var(--text-secondary); font-size: 16px;">
                Pick proven habits from the catalog, or click below to craft a custom habit.
            </p>
        </div>

        <c:if test="${not empty errorMessage}">
            <div class="alert alert-error">
                <c:out value="${errorMessage}"/>
            </div>
        </c:if>

        <!-- Predefined Habits Stack -->
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px;">
            
            <div class="habit-item">
                <div class="habit-left">
                    <div class="habit-icon">💧</div>
                    <div>
                        <div class="habit-name">Drink 2L Water</div>
                        <div class="habit-meta">Health &bull; Daily target: 2000 ml</div>
                    </div>
                </div>
                <span class="brand-badge">Selected</span>
            </div>

            <div class="habit-item">
                <div class="habit-left">
                    <div class="habit-icon">🏋️</div>
                    <div>
                        <div class="habit-name">30-min Workout</div>
                        <div class="habit-meta">Fitness &bull; Daily target: 30 mins</div>
                    </div>
                </div>
                <span class="brand-badge">Selected</span>
            </div>

            <div class="habit-item">
                <div class="habit-left">
                    <div class="habit-icon">📖</div>
                    <div>
                        <div class="habit-name">Read 10 Pages</div>
                        <div class="habit-meta">Mindset &bull; Daily target: 10 pages</div>
                    </div>
                </div>
                <span class="brand-badge">Selected</span>
            </div>

            <div class="habit-item">
                <div class="habit-left">
                    <div class="habit-icon">🧘</div>
                    <div>
                        <div class="habit-name">Meditate 10 Mins</div>
                        <div class="habit-meta">Mindfulness &bull; Daily target: 10 mins</div>
                    </div>
                </div>
                <span class="brand-badge">Selected</span>
            </div>

            <div class="habit-item">
                <div class="habit-left">
                    <div class="habit-icon">🌙</div>
                    <div>
                        <div class="habit-name">Sleep Before 11 PM</div>
                        <div class="habit-meta">Recovery &bull; Target: 1 time</div>
                    </div>
                </div>
                <span class="brand-badge">Selected</span>
            </div>

            <div class="habit-item">
                <div class="habit-left">
                    <div class="habit-icon">💻</div>
                    <div>
                        <div class="habit-name">Study DSA (1 Hour)</div>
                        <div class="habit-meta">Career &bull; Daily target: 60 mins</div>
                    </div>
                </div>
                <span class="brand-badge">Selected</span>
            </div>

            <div class="habit-item">
                <div class="habit-left">
                    <div class="habit-icon">🚶</div>
                    <div>
                        <div class="habit-name">Walk 8,000 Steps</div>
                        <div class="habit-meta">Fitness &bull; Daily target: 8000 steps</div>
                    </div>
                </div>
                <span class="brand-badge">Selected</span>
            </div>
        </div>

        <!-- Add Custom Habit Accordion/Card -->
        <div class="card" style="margin-bottom: 36px; border: 1.5px dashed var(--brand-soft); background: var(--bg-surface-subtle);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="font-size: 18px;">✨ Add a Custom Habit</h3>
                <span style="font-size: 12px; color: var(--text-muted);">Personalized to you</span>
            </div>

            <form action="add-habit" method="POST">
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Habit Name *</label>
                        <input type="text" name="habitName" class="form-input" placeholder="e.g. Practice Guitar, Cold Shower" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Icon Emoji</label>
                        <input type="text" name="icon" class="form-input" value="⚡" maxlength="4">
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Target Number *</label>
                        <input type="number" name="target" class="form-input" value="1" min="1" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Unit *</label>
                        <input type="text" name="unit" class="form-input" value="times" placeholder="e.g. mins, pages, ml" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Reminder Time</label>
                        <input type="text" name="reminderTime" class="form-input" value="08:00 PM">
                    </div>
                </div>

                <button type="submit" class="btn btn-outline" style="width: 100%; border-color: var(--brand-primary); color: var(--brand-primary);">
                    + Save Custom Habit to My Stack
                </button>
            </form>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
            <a href="onboarding.jsp" style="color: var(--text-muted); font-size: 14px; font-weight: 600;">← Back to Goals</a>
            <a href="reminders.jsp?onboarding=true" class="btn btn-primary" style="padding: 14px 36px; font-size: 16px;">
                Next: Set Reminders →
            </a>
        </div>
    </main>

</body>
</html>
