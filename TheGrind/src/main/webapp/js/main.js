/**
 * THE GRIND – Habit Challenge Club
 * Main Frontend Script: DOM Manipulation & Browser Object Model (BOM)
 * Demonstrates:
 * - DOM Selection: getElementById, querySelector, querySelectorAll
 * - Event Handling: addEventListener
 * - Class & Content updates: classList.toggle, textContent, innerHTML
 * - Form validation and password visibility toggle
 * - BOM features: window.location, history, localStorage
 * - Asynchronous fetch API communicating with Java Servlets
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('[The Grind] Frontend initialized via DOMContentLoaded.');

    // 1. Password Visibility Toggle
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const currentType = passwordInput.getAttribute('type');
            const newType = currentType === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', newType);
            togglePasswordBtn.textContent = newType === 'password' ? '👁️' : '🔒';
        });
    }

    // 2. Client-side Form Validation
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            const pass = document.getElementById('password').value;
            const confirm = document.getElementById('confirmPassword').value;
            const errorBox = document.getElementById('clientValidationAlert');

            if (pass !== confirm) {
                e.preventDefault();
                if (errorBox) {
                    errorBox.textContent = 'Passwords do not match! Please check your input.';
                    errorBox.style.display = 'block';
                } else {
                    alert('Passwords do not match!');
                }
            }
        });
    }

    // 3. Habit Completion Checkbox Handler (AJAX + DOM Manipulation)
    const habitCheckButtons = document.querySelectorAll('.habit-check-btn');
    habitCheckButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const habitId = this.getAttribute('data-habit-id');
            const isCurrentlyChecked = this.classList.contains('checked');
            const targetState = !isCurrentlyChecked;

            // Optimistic DOM Update
            this.classList.toggle('checked');
            this.textContent = targetState ? '✓' : '';
            const habitItemCard = this.closest('.habit-item');
            if (habitItemCard) {
                habitItemCard.classList.toggle('completed', targetState);
            }

            // Update today's progress counters in the DOM
            updateDashboardCounters(targetState);

            // Send AJAX POST to Java Servlet (CompleteHabitServlet)
            const formData = new URLSearchParams();
            formData.append('habitId', habitId);
            formData.append('completed', targetState.toString());

            fetch('complete-habit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData.toString()
            })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    console.error('Failed to persist completion:', data.error);
                    // Rollback DOM state on failure
                    btn.classList.toggle('checked', isCurrentlyChecked);
                    btn.textContent = isCurrentlyChecked ? '✓' : '';
                    if (habitItemCard) habitItemCard.classList.toggle('completed', isCurrentlyChecked);
                    updateDashboardCounters(!targetState);
                } else {
                    console.log('Habit status successfully saved to MySQL via Servlet.');
                }
            })
            .catch(err => {
                console.error('Network/Server error during habit completion:', err);
            });
        });
    });

    // 4. Helper: Recalculate Dashboard Stats in DOM
    function updateDashboardCounters(increment) {
        const completedCountEl = document.getElementById('completedCountDisplay');
        const progressPctEl = document.getElementById('completionPctDisplay');
        const progressBarFill = document.getElementById('progressBarFill');
        const totalCountEl = document.getElementById('totalCountDisplay');

        if (completedCountEl && totalCountEl) {
            let current = parseInt(completedCountEl.textContent, 10) || 0;
            const total = parseInt(totalCountEl.textContent, 10) || 1;

            current = increment ? current + 1 : Math.max(0, current - 1);
            completedCountEl.textContent = current;

            const newPct = Math.min(100, Math.round((current / total) * 100));
            if (progressPctEl) progressPctEl.textContent = newPct + '%';
            if (progressBarFill) progressBarFill.style.width = newPct + '%';
        }
    }

    // 5. Browser Object Model (BOM) Demonstrations
    // Check URL parameters using BOM window.location
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('welcome')) {
        const toast = document.createElement('div');
        toast.className = 'alert alert-success';
        toast.textContent = '🎉 Welcome to The Grind! Your consistency journey begins now.';
        const container = document.querySelector('.container');
        if (container) container.insertBefore(toast, container.firstChild);

        // Clear query param using BOM history.replaceState
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
