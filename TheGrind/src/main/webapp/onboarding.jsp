<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>What are your goals? – THE GRIND</title>
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
                Step 1 of 3: Set Your Vision
            </div>
        </div>
    </header>

    <main class="container" style="max-width: 680px; padding-top: 40px; padding-bottom: 60px;">
        <div style="text-align: center; margin-bottom: 36px;">
            <div style="font-size: 40px; margin-bottom: 12px;">🎯</div>
            <h1 style="font-size: 32px; margin-bottom: 8px;">What are your core goals?</h1>
            <p style="color: var(--text-secondary); font-size: 16px;">Select all that resonate. The Grind will tailor your recommendations and coaching.</p>
        </div>

        <form action="goals" method="POST">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 36px;">

                <!-- Option 1 -->
                <label class="card goal-card" style="display: flex; align-items: center; gap: 16px; cursor: pointer; padding: 18px 20px;">
                    <input type="checkbox" name="goals" value="Build Consistency" checked style="width: 20px; height: 20px; accent-color: var(--brand-primary);">
                    <div>
                        <div style="font-weight: 700; font-size: 16px;">🔥 Build Consistency</div>
                        <div style="font-size: 13px; color: var(--text-muted);">Stop quitting and maintain 30+ day streaks</div>
                    </div>
                </label>

                <!-- Option 2 -->
                <label class="card goal-card" style="display: flex; align-items: center; gap: 16px; cursor: pointer; padding: 18px 20px;">
                    <input type="checkbox" name="goals" value="Be Healthier" checked style="width: 20px; height: 20px; accent-color: var(--brand-primary);">
                    <div>
                        <div style="font-weight: 700; font-size: 16px;">🥗 Be Healthier</div>
                        <div style="font-size: 13px; color: var(--text-muted);">Nutritious diet, hydration & mental peace</div>
                    </div>
                </label>

                <!-- Option 3 -->
                <label class="card goal-card" style="display: flex; align-items: center; gap: 16px; cursor: pointer; padding: 18px 20px;">
                    <input type="checkbox" name="goals" value="Read More" checked style="width: 20px; height: 20px; accent-color: var(--brand-primary);">
                    <div>
                        <div style="font-weight: 700; font-size: 16px;">📚 Read More</div>
                        <div style="font-size: 13px; color: var(--text-muted);">Read 10-20 pages daily for deep learning</div>
                    </div>
                </label>

                <!-- Option 4 -->
                <label class="card goal-card" style="display: flex; align-items: center; gap: 16px; cursor: pointer; padding: 18px 20px;">
                    <input type="checkbox" name="goals" value="Improve Fitness" checked style="width: 20px; height: 20px; accent-color: var(--brand-primary);">
                    <div>
                        <div style="font-weight: 700; font-size: 16px;">💪 Improve Fitness</div>
                        <div style="font-size: 13px; color: var(--text-muted);">Daily workouts, runs, and 8,000+ steps</div>
                    </div>
                </label>

                <!-- Option 5 -->
                <label class="card goal-card" style="display: flex; align-items: center; gap: 16px; cursor: pointer; padding: 18px 20px;">
                    <input type="checkbox" name="goals" value="Sleep Better" style="width: 20px; height: 20px; accent-color: var(--brand-primary);">
                    <div>
                        <div style="font-weight: 700; font-size: 16px;">🌙 Sleep Better</div>
                        <div style="font-size: 13px; color: var(--text-muted);">Maintain a fixed 10:30 PM bedtime</div>
                    </div>
                </label>

                <!-- Option 6 -->
                <label class="card goal-card" style="display: flex; align-items: center; gap: 16px; cursor: pointer; padding: 18px 20px;">
                    <input type="checkbox" name="goals" value="Reduce Screen Time" style="width: 20px; height: 20px; accent-color: var(--brand-primary);">
                    <div>
                        <div style="font-weight: 700; font-size: 16px;">📵 Reduce Screen Time</div>
                        <div style="font-size: 13px; color: var(--text-muted);">Cut doomscrolling & mindless social media</div>
                    </div>
                </label>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <a href="dashboard" style="color: var(--text-muted); font-size: 14px; font-weight: 600;">Skip for now</a>
                <button type="submit" class="btn btn-primary" style="padding: 14px 36px; font-size: 16px;">
                    Next: Choose Habits →
                </button>
            </div>
        </form>
    </main>

</body>
</html>
