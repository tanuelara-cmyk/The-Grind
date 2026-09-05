<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account – THE GRIND</title>
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
                <a href="login.jsp" class="btn btn-outline btn-sm">Sign In</a>
            </div>
        </div>
    </header>

    <div class="container auth-container" style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
        <div class="card" style="padding: 36px 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 36px; margin-bottom: 8px;">🚀</div>
                <h2 style="font-size: 26px; margin-bottom: 6px;">Join The Grind</h2>
                <p style="color: var(--text-secondary); font-size: 14px;">Build daily habits that last a lifetime.</p>
            </div>

            <!-- Client & Server Error Alerts -->
            <div id="clientValidationAlert" class="alert alert-error" style="display: none;"></div>
            <c:if test="${not empty errorMessage}">
                <div class="alert alert-error">
                    <c:out value="${errorMessage}"/>
                </div>
            </c:if>

            <form action="register" method="POST" id="registerForm">
                <div class="form-group">
                    <label class="form-label" for="fullName">Full Name</label>
                    <input type="text" id="fullName" name="fullName" class="form-input" 
                           placeholder="Tanu Sharma" value="${fullName}" required minlength="2">
                </div>

                <div class="form-group">
                    <label class="form-label" for="email">Email Address</label>
                    <input type="email" id="email" name="email" class="form-input" 
                           placeholder="tanu@example.com" value="${email}" required>
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <input type="password" id="password" name="password" class="form-input" 
                           placeholder="Minimum 6 characters" required minlength="6">
                </div>

                <div class="form-group">
                    <label class="form-label" for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" class="form-input" 
                           placeholder="Re-enter password" required minlength="6">
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 15px; margin-top: 10px;">
                    Continue to Onboarding →
                </button>
            </form>

            <div style="margin-top: 24px; text-align: center; font-size: 14px; color: var(--text-secondary); border-top: 1px solid var(--border-subtle); padding-top: 20px;">
                Already have an account? <a href="login.jsp" style="font-weight: 700;">Sign In</a>
            </div>
        </div>
    </div>

    <script src="js/main.js"></script>
</body>
</html>
