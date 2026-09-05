-- =======================================================
-- Database: the_grind
-- College Java Full Stack Mini Project Schema
-- =======================================================

DROP DATABASE IF EXISTS the_grind;
CREATE DATABASE the_grind CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE the_grind;

-- 1. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT 'default_avatar.png',
    current_streak INT DEFAULT 0,
    best_streak INT DEFAULT 0,
    total_completed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. Goals Table (User Onboarding Goals)
CREATE TABLE goals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_goals_user (user_id)
) ENGINE=InnoDB;

-- 3. Master Habits Table (Predefined catalog and base habits)
CREATE TABLE habits (
    habit_id INT AUTO_INCREMENT PRIMARY KEY,
    habit_name VARCHAR(100) NOT NULL,
    description TEXT,
    default_target INT DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'times',
    frequency VARCHAR(50) DEFAULT 'Daily',
    icon VARCHAR(20) DEFAULT '💧',
    category VARCHAR(50) DEFAULT 'Health',
    is_custom BOOLEAN DEFAULT FALSE,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. User Habits Table (Habits adopted or customized by user)
CREATE TABLE user_habits (
    user_habit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    habit_id INT NULL,
    habit_name VARCHAR(100) NOT NULL,
    description TEXT,
    target_value INT NOT NULL DEFAULT 1,
    unit VARCHAR(50) NOT NULL DEFAULT 'times',
    frequency VARCHAR(50) NOT NULL DEFAULT 'Daily',
    icon VARCHAR(20) DEFAULT '💧',
    category VARCHAR(50) DEFAULT 'Health',
    reminder_time VARCHAR(20) DEFAULT '08:00 AM',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES habits(habit_id) ON DELETE SET NULL,
    INDEX idx_user_habits_user (user_id)
) ENGINE=InnoDB;

-- 5. Habit Completions Table (Daily progress logs)
CREATE TABLE habit_completions (
    completion_id INT AUTO_INCREMENT PRIMARY KEY,
    user_habit_id INT NOT NULL,
    user_id INT NOT NULL,
    completion_date DATE NOT NULL,
    progress_value INT NOT NULL DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_habit_id) REFERENCES user_habits(user_habit_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_habit_day (user_habit_id, completion_date),
    INDEX idx_completions_user_date (user_id, completion_date)
) ENGINE=InnoDB;

-- 6. Reminders Table
CREATE TABLE reminders (
    reminder_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reminder_time VARCHAR(20) NOT NULL DEFAULT '08:00 AM',
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    notification_channel VARCHAR(50) DEFAULT 'Browser/Push',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_reminders_user (user_id)
) ENGINE=InnoDB;

-- 7. Notifications Table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    notification_type VARCHAR(50) DEFAULT 'REMINDER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id)
) ENGINE=InnoDB;

-- 8. Chat Messages Table (Grind Coach Chatbot)
CREATE TABLE chat_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sender VARCHAR(20) NOT NULL DEFAULT 'USER', -- 'USER' or 'COACH'
    message_text TEXT NOT NULL,
    intent VARCHAR(50) DEFAULT 'GENERAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_chat_user (user_id)
) ENGINE=InnoDB;

-- =======================================================
-- Initial Seed Data: Master Habits Catalog
-- =======================================================
INSERT INTO habits (habit_name, description, default_target, unit, frequency, icon, category) VALUES
('Drink 2L Water', 'Helps stay hydrated, increases energy levels and improves daily cognitive focus.', 2, 'Liters', 'Daily', '💧', 'Health'),
('Workout 30 mins', 'Cardio or strength training to maintain cardiovascular health and physical stamina.', 30, 'Mins', 'Daily', '🏃', 'Fitness'),
('Read 20 pages', 'Improves vocabulary, concentration, and fosters lifelong intellectual learning.', 20, 'Pages', 'Daily', '📖', 'Learning'),
('Meditate 10 mins', 'Mindfulness practice to relieve stress, enhance mental clarity and promote calm.', 10, 'Mins', 'Daily', '🧘', 'Mindfulness'),
('Sleep before 11 PM', 'Get 7-8 hours of sound restorative sleep for optimal recovery and hormone balance.', 1, 'Night', 'Daily', '🌙', 'Rest'),
('Study DSA', 'Practice Data Structures, Algorithms, and coding problems for interview mastery.', 60, 'Mins', 'Daily', '📝', 'Education'),
('Coding Practice', 'Work on web development or personal GitHub programming projects.', 45, 'Mins', 'Daily', '💻', 'Education'),
('Evening Walk', 'Brisk 5000+ step walk in fresh air to clear mind and stimulate metabolism.', 30, 'Mins', 'Daily', '🚶', 'Fitness'),
('Creative Hobby', 'Engage in sketching, guitar, creative writing, or personal art projects.', 20, 'Mins', 'Daily', '🎨', 'Creativity');

-- Initial Demo User (Password: password123, hashed using SHA-256 with salt)
-- SHA-256 for 'password123': ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
INSERT INTO users (user_id, full_name, email, password_hash, current_streak, best_streak, total_completed) VALUES
(1, 'Tanu Sharma', 'tanu.elara@gmail.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 7, 14, 38);

INSERT INTO goals (user_id, goal_title) VALUES
(1, 'Build Consistency'),
(1, 'Be Healthier'),
(1, 'Improve Fitness'),
(1, 'Read More');

INSERT INTO user_habits (user_habit_id, user_id, habit_id, habit_name, description, target_value, unit, frequency, icon, category, reminder_time) VALUES
(1, 1, 1, 'Drink 2L Water', 'Helps stay hydrated and improves focus throughout the workday.', 2, 'Liters', 'Daily', '💧', 'Health', '08:00 AM'),
(2, 1, 2, 'Workout 30 mins', 'Cardio or gym workout to maintain energy and tone.', 30, 'Mins', 'Daily', '🏃', 'Fitness', '07:00 AM'),
(3, 1, 3, 'Read 20 pages', 'Read non-fiction book to learn new concepts consistently.', 20, 'Pages', 'Daily', '📖', 'Learning', '09:00 PM'),
(4, 1, 4, 'Meditate 10 mins', 'Silent breathwork session to calm nervous system before starting tasks.', 10, 'Mins', 'Daily', '🧘', 'Mindfulness', '07:30 AM'),
(5, 1, 5, 'Sleep before 11 PM', 'Maintain circadian rhythm and wake up energized.', 1, 'Night', 'Daily', '🌙', 'Rest', '10:30 PM');

-- Insert Today's Completions for Tanu (demonstrating 5/8 completion status from prototype)
INSERT INTO habit_completions (user_habit_id, user_id, completion_date, progress_value, is_completed) VALUES
(1, 1, CURRENT_DATE(), 2, TRUE),
(2, 1, CURRENT_DATE(), 30, TRUE),
(3, 1, CURRENT_DATE(), 10, FALSE),
(4, 1, CURRENT_DATE(), 0, FALSE),
(5, 1, CURRENT_DATE(), 0, FALSE);

INSERT INTO reminders (user_id, reminder_time, is_enabled) VALUES
(1, '08:00 AM', TRUE);

INSERT INTO notifications (user_id, title, message, is_read, notification_type) VALUES
(1, 'Morning Reminder ⏰', 'Rise and grind! Drink a fresh glass of water to start your day.', FALSE, 'REMINDER'),
(1, 'Streak Milestone 🔥', 'Incredible consistency! You are now on a 7-day habit streak.', TRUE, 'ACHIEVEMENT');
