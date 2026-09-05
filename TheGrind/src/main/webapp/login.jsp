<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log In – THE GRIND</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body style="display: flex; flex-direction: column; min-height: 100vh;">

    <!-- Top Navigation Minimal -->
    <header class="app-header">
        <div class="container nav-wrapper">
            <a href="index.jsp" class="brand-logo">
                <span style="font-size: 26px;">🌱</span>
                <span>THE GRIND</span>
            </a>
            <div>
                <a href="register.jsp" class="btn btn-outline btn-sm">Create Account</a>
            </div>
        </div>
    </header>

    <div class="container auth-container" style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
        <div class="card" style="padding: 36px 32px;">
            <div style="text-align: center; margin-bottom: 28px;">
                <div style="font-size: 36px; margin-bottom: 8px;">👋</div>
                <h2 style="font-size: 26px; margin-bottom: 6px;">Welcome Back</h2>
                <p style="color: var(--text-secondary); font-size: 14px;">Log in to stay on track with your habits.</p>
            </div>

            <!-- Error Notification -->
            <c:if test="${not empty errorMessage}">
                <div class="alert alert-error">
                    <strong>Error:</strong> <c:out value="${errorMessage}"/>
                </div>
            </c:if>
            <c:if test="${param.error == 'unauthorized'}">
                <div class="alert alert-error">
                    Please log in to access your dashboard.
                </div>
            </c:if>

            <form action="login" method="POST" id="loginForm">
                <div class="form-group">
                    <label class="form-label" for="email">Email Address</label>
                    <input type="email" id="email" name="email" class="form-input" 
                           placeholder="tanu@example.com" value="${email != null ? email : 'demo@thegrind.club'}" required>
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <div style="position: relative;">
                        <input type="password" id="password" name="password" class="form-input" 
                               placeholder="••••••••" value="grind123" required style="padding-right: 44px;">
                        <button type="button" id="togglePassword" 
                                style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px;">
                            👁️
                        </button>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-size: 13px;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: var(--text-secondary);">
                        <input type="checkbox" name="rememberMe" checked> Remember me
                    </label>
                    <a href="#" style="color: var(--brand-primary); font-weight: 600;">Forgot Password?</a>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 15px;">
                    Sign In to Dashboard →
                </button>
            </form>

            <div style="margin-top: 24px; text-align: center; font-size: 14px; color: var(--text-secondary); border-top: 1px solid var(--border-subtle); padding-top: 20px;">
                Don't have an account? <a href="register.jsp" style="font-weight: 700;">Join The Grind</a>
            </div>
        </div>
    </div>

    <script src="js/main.js"></script>
</body>
</html>
