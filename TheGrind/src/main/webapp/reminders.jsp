<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Set Daily Reminder – THE GRIND</title>
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
                Step 3 of 3: Lock In Reminders
            </div>
        </div>
    </header>

    <main class="container" style="max-width: 600px; padding-top: 50px; padding-bottom: 60px;">
        <div class="card" style="padding: 40px 32px; text-align: center;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--brand-light); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 20px auto;">
                ⏰
            </div>
            <h1 style="font-size: 28px; margin-bottom: 8px;">Set Daily Reminder</h1>
            <p style="color: var(--text-secondary); font-size: 15px; margin-bottom: 32px;">
                Consistency is formed by reliable cues. Choose a daily time when you'd like Grind Coach to prompt your check-in.
            </p>

            <form action="reminders" method="POST">
                <input type="hidden" name="onboarding" value="${param.onboarding != null ? param.onboarding : 'true'}">

                <!-- Toggle Enable -->
                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-subtle); padding: 16px 20px; border-radius: var(--radius-md); margin-bottom: 24px; text-align: left;">
                    <div>
                        <div style="font-weight: 700; font-size: 15px;">Enable Daily Check-in Alert</div>
                        <div style="font-size: 13px; color: var(--text-muted);">Receive background push & in-app alerts</div>
                    </div>
                    <label style="position: relative; display: inline-block; width: 48px; height: 26px;">
                        <input type="checkbox" name="enabled" value="true" checked style="width: 22px; height: 22px; accent-color: var(--brand-primary);">
                    </label>
                </div>

                <!-- Time Presets -->
                <div class="form-group" style="text-align: left;">
                    <label class="form-label">Preferred Reminder Time</label>
                    <input type="text" id="reminderTimeInput" name="reminderTime" class="form-input" 
                           value="${reminder != null ? reminder.reminderTime : '08:00 AM'}" required style="text-align: center; font-size: 18px; font-weight: 700;">
                </div>

                <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px;">
                    <button type="button" class="btn btn-outline btn-sm time-preset" data-time="07:00 AM">07:00 AM (Morning)</button>
                    <button type="button" class="btn btn-outline btn-sm time-preset" data-time="08:00 AM">08:00 AM (Routine)</button>
                    <button type="button" class="btn btn-outline btn-sm time-preset" data-time="01:00 PM">01:00 PM (Midday)</button>
                    <button type="button" class="btn btn-outline btn-sm time-preset" data-time="08:30 PM">08:30 PM (Evening)</button>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 16px;">
                    Complete Setup & Go to Dashboard →
                </button>
            </form>
        </div>
    </main>

    <script>
        document.querySelectorAll('.time-preset').forEach(btn => {
            btn.addEventListener('click', function() {
                const time = this.getAttribute('data-time');
                document.getElementById('reminderTimeInput').value = time;
            });
        });
    </script>
</body>
</html>
