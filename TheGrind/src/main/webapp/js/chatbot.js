/**
 * THE GRIND – Grind Coach Chatbot Script
 * Powers the interactive floating coach interface.
 * Demonstrates:
 * - DOM manipulation: dynamic bubble creation, scrolling, suggestion handling
 * - AJAX communication with ChatbotServlet
 * - Keyboard event handling (Enter to send)
 */

document.addEventListener('DOMContentLoaded', () => {
    const chatFab = document.getElementById('chatFab');
    const chatDrawer = document.getElementById('chatDrawer');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatMessagesContainer = document.getElementById('chatMessages');
    const chatSuggestionsContainer = document.getElementById('chatSuggestions');

    if (!chatFab || !chatDrawer) return;

    // Toggle Chat Drawer visibility
    chatFab.addEventListener('click', () => {
        const isHidden = chatDrawer.style.display === 'none' || chatDrawer.style.display === '';
        chatDrawer.style.display = isHidden ? 'flex' : 'none';
        if (isHidden && chatInput) chatInput.focus();
    });

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatDrawer.style.display = 'none';
        });
    }

    // Send message on Enter or Button click
    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Append user message to DOM
        appendMessage(text, 'user');
        chatInput.value = '';

        // 2. Clear previous suggestions
        if (chatSuggestionsContainer) chatSuggestionsContainer.innerHTML = '';

        // 3. Show typing indicator
        const typingIndicator = appendMessage('Grind Coach is typing...', 'coach typing');

        // 4. Send AJAX POST to ChatbotServlet
        const params = new URLSearchParams();
        params.append('message', text);

        fetch('chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: params.toString()
        })
        .then(res => res.json())
        .then(data => {
            // Remove typing indicator
            if (typingIndicator) typingIndicator.remove();

            // Append Coach's response to DOM
            appendMessage(data.reply, 'coach');

            // Render suggestions
            if (data.suggestions && data.suggestions.length > 0) {
                renderSuggestions(data.suggestions);
            }
        })
        .catch(err => {
            if (typingIndicator) typingIndicator.remove();
            appendMessage("Keep pushing! Small steps lead to big changes. You've got this!", 'coach');
        });
    }

    function appendMessage(text, type) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + type;
        bubble.textContent = text;
        chatMessagesContainer.appendChild(bubble);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        return bubble;
    }

    function renderSuggestions(suggestions) {
        if (!chatSuggestionsContainer) return;
        chatSuggestionsContainer.innerHTML = '';
        suggestions.forEach(s => {
            const pill = document.createElement('button');
            pill.className = 'suggestion-pill';
            pill.textContent = s;
            pill.addEventListener('click', () => {
                chatInput.value = s;
                handleSendMessage();
            });
            chatSuggestionsContainer.appendChild(pill);
        });
    }

    // Attach click handlers to initial static suggestions
    document.querySelectorAll('.suggestion-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            chatInput.value = this.textContent.trim();
            handleSendMessage();
        });
    });
});
