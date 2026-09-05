<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Progress Analytics – THE GRIND</title>
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
                <li><a href="progress" class="active">Progress</a></li>
                <li><a href="select-habits.jsp">Habits Catalog</a></li>
                <li><a href="reminders">Reminders</a></li>
            </ul>
            <div>
                <a href="dashboard" class="btn btn-outline btn-sm">← Back to Dashboard</a>
            </div>
        </div>
    </header>

    <main class="container" style="padding-top: 36px; padding-bottom: 80px;">

        <div style="margin-bottom: 28px;">
            <div style="display: inline-flex; align-items: center; gap: 8px; background: var(--brand-light); color: var(--brand-primary); padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; margin-bottom: 8px;">
                📈 Analytics & Insights
            </div>
            <h1 style="font-size: 32px;">Consistency Overview</h1>
            <p style="color: var(--text-secondary); font-size: 15px;">
                Inspect your habits consistency, completion percentages, and milestone streaks.
            </p>
        </div>

        <!-- Weekly Overview Day-by-Day Card (Monday to Sunday) -->
        <div class="card" style="margin-bottom: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div>
                    <h3 style="font-size: 20px;">Weekly Performance</h3>
                    <p style="font-size: 13px; color: var(--text-muted);">Monday through Sunday completion rate</p>
                </div>
                <div style="background: var(--brand-light); color: var(--brand-primary); font-weight: 800; padding: 6px 14px; border-radius: var(--radius-full); font-size: 14px;">
                    Weekly Avg: ${progress != null ? progress.weeklyCompletionRate : 74}%
                </div>
            </div>

            <!-- Weekly Bar Chart -->
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 16px; align-items: flex-end; min-height: 200px; padding: 20px 0 10px 0; border-bottom: 1px solid var(--border-subtle);">
                
                <!-- Monday -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--brand-primary);">${progress != null ? progress.dailyPercentages[0] : 60}%</span>
                    <div style="width: 100%; max-width: 44px; height: ${progress != null ? progress.dailyPercentages[0] * 1.5 : 90}px; background: var(--brand-soft); border-radius: 6px 6px 0 0;"></div>
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Mon</span>
                </div>

                <!-- Tuesday -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--brand-primary);">${progress != null ? progress.dailyPercentages[1] : 80}%</span>
                    <div style="width: 100%; max-width: 44px; height: ${progress != null ? progress.dailyPercentages[1] * 1.5 : 120}px; background: var(--brand-primary); border-radius: 6px 6px 0 0;"></div>
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Tue</span>
                </div>

                <!-- Wednesday -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--brand-primary);">${progress != null ? progress.dailyPercentages[2] : 100}%</span>
                    <div style="width: 100%; max-width: 44px; height: ${progress != null ? progress.dailyPercentages[2] * 1.5 : 150}px; background: var(--brand-primary); border-radius: 6px 6px 0 0;"></div>
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Wed</span>
                </div>

                <!-- Thursday -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--brand-primary);">${progress != null ? progress.dailyPercentages[3] : 60}%</span>
                    <div style="width: 100%; max-width: 44px; height: ${progress != null ? progress.dailyPercentages[3] * 1.5 : 90}px; background: var(--brand-soft); border-radius: 6px 6px 0 0;"></div>
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Thu</span>
                </div>

                <!-- Friday -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--brand-primary);">${progress != null ? progress.dailyPercentages[4] : 80}%</span>
                    <div style="width: 100%; max-width: 44px; height: ${progress != null ? progress.dailyPercentages[4] * 1.5 : 120}px; background: var(--brand-primary); border-radius: 6px 6px 0 0;"></div>
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Fri</span>
                </div>

                <!-- Saturday -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--brand-primary);">${progress != null ? progress.dailyPercentages[5] : 100}%</span>
                    <div style="width: 100%; max-width: 44px; height: ${progress != null ? progress.dailyPercentages[5] * 1.5 : 150}px; background: var(--brand-primary); border-radius: 6px 6px 0 0;"></div>
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Sat</span>
                </div>

                <!-- Sunday -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--brand-primary);">${progress != null ? progress.dailyPercentages[6] : 50}%</span>
                    <div style="width: 100%; max-width: 44px; height: ${progress != null ? progress.dailyPercentages[6] * 1.5 : 75}px; background: var(--brand-soft); border-radius: 6px 6px 0 0;"></div>
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Sun</span>
                </div>
            </div>
        </div>

        <!-- 4 Stats Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
            <div class="card">
                <div style="font-size: 28px; margin-bottom: 8px;">🔥</div>
                <div class="stat-value">${progress != null ? progress.currentStreak : 7} Days</div>
                <div class="stat-label">Current Active Streak</div>
            </div>

            <div class="card">
                <div style="font-size: 28px; margin-bottom: 8px;">🏆</div>
                <div class="stat-value">${progress != null ? progress.bestStreak : 14} Days</div>
                <div class="stat-label">All-Time Best Streak</div>
            </div>

            <div class="card">
                <div style="font-size: 28px; margin-bottom: 8px;">⚡</div>
                <div class="stat-value">${progress != null ? progress.totalCompletedHabits : 42}</div>
                <div class="stat-label">Total Completed Habits</div>
            </div>

            <div class="card">
                <div style="font-size: 28px; margin-bottom: 8px;">🎯</div>
                <div class="stat-value">${progress != null ? progress.dailyCompletionRate : 63}%</div>
                <div class="stat-label">Today's Rate</div>
            </div>
        </div>

        <!-- Club Membership Tier Card -->
        <div class="card" style="margin-top: 32px; background: linear-gradient(135deg, #FFFFFF 0%, var(--brand-light) 100%); border: 1.5px solid var(--brand-soft); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 56px; height: 56px; border-radius: 50%; background: #FFF; display: flex; align-items: center; justify-content: center; font-size: 30px; box-shadow: var(--card-shadow);">
                    🏅
                </div>
                <div>
                    <div style="font-size: 12px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase;">Member Status</div>
                    <div style="font-size: 20px; font-weight: 800;">Silver Grinder Tier</div>
                    <div style="font-size: 13px; color: var(--text-secondary);">3 more days of consistency to unlock Gold Grinder status!</div>
                </div>
            </div>
            <a href="dashboard" class="btn btn-primary btn-sm">Log Habits Today →</a>
        </div>
    </main>

</body>
</html>
