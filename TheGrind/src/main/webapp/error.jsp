<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Notice – THE GRIND</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body style="display: flex; flex-direction: column; min-height: 100vh; justify-content: center; align-items: center;">

    <div class="card" style="max-width: 480px; width: 90%; text-align: center; padding: 40px 24px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🌱</div>
        <h2 style="font-size: 24px; margin-bottom: 8px;">Notice from The Grind</h2>
        <p style="color: var(--text-secondary); font-size: 15px; margin-bottom: 24px;">
            <c:choose>
                <c:when test="${not empty errorMessage}">
                    <c:out value="${errorMessage}"/>
                </c:when>
                <c:otherwise>
                    An unexpected situation occurred while handling your request.
                </c:otherwise>
            </c:choose>
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
            <a href="dashboard" class="btn btn-primary">Return to Dashboard</a>
            <a href="login.jsp" class="btn btn-outline">Sign In</a>
        </div>
    </div>

</body>
</html>
