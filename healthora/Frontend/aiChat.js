const toggleButton = document.getElementById("healthora-ai-toggle");
const closeButton = document.getElementById("healthora-ai-close");
const panel = document.getElementById("healthora-ai-panel");
const form = document.getElementById("healthora-ai-form");
const input = document.getElementById("healthora-ai-input");
const sendButton = document.getElementById("healthora-ai-send");
const messagesContainer = document.getElementById("healthora-ai-messages");
const statusElement = document.getElementById("healthora-ai-status");
const newChatButton = document.getElementById("healthora-ai-new-chat");

const API_URL = "http://localhost:5000/api/ai/chat";
const STORAGE_KEY = "healthora_ai_chats";
const ACTIVE_CHAT_KEY = "healthora_ai_active_chat";

let isSending = false;
let currentRequestController = null;
let requestId = 0;

// ==================== CHAT STORAGE ====================

function loadChats() {
    try {
        const chats = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(chats) ? chats : [];
    } catch (error) {
        console.error("Unable to load saved chats:", error);
        return [];
    }
}

function saveChats(chats) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
        console.error("Unable to save chats:", error);
    }
}

function createChat() {
    const chat = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: "New Chat",
        messages: [],
        updatedAt: new Date().toISOString()
    };

    const chats = loadChats();
    chats.unshift(chat);

    saveChats(chats);
    localStorage.setItem(ACTIVE_CHAT_KEY, chat.id);

    return chat;
}

function getActiveChat() {
    const chats = loadChats();
    const activeId = localStorage.getItem(ACTIVE_CHAT_KEY);

    return chats.find(chat => chat.id === activeId) || null;
}

let activeChat = getActiveChat();

if (!activeChat) {
    activeChat = createChat();
}

function saveActiveChat() {
    if (!activeChat) return;

    const chats = loadChats();
    const index = chats.findIndex(chat => chat.id === activeChat.id);

    activeChat.updatedAt = new Date().toISOString();

    if (index !== -1) {
        chats[index] = activeChat;
    } else {
        chats.unshift(activeChat);
    }

    saveChats(chats);
    localStorage.setItem(ACTIVE_CHAT_KEY, activeChat.id);
}

// ==================== MESSAGE DISPLAY ====================

function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `healthora-ai-message ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = "healthora-ai-bubble";
    bubble.textContent = text;

    message.appendChild(bubble);
    messagesContainer.appendChild(message);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ==================== QUICK PROMPTS ====================

function showWelcomeMessage() {
    messagesContainer.replaceChildren();

    addMessage(
        "Hi! 👋 I'm Healthora AI. Ask me general questions about health, sleep, nutrition, or wellness.",
        "assistant"
    );

    const prompts = [
        {
            label: "🌙 Sleep Tips",
            question: "How can I improve my sleep quality?"
        },
        {
            label: "🥗 Healthy Diet",
            question: "What does a balanced and healthy daily diet look like?"
        },
        {
            label: "🧘 Stress Management",
            question: "What are some simple ways to manage daily stress?"
        },
        {
            label: "💧 Daily Hydration",
            question: "How can I build a healthy daily hydration routine?"
        }
    ];

    const promptContainer = document.createElement("div");
    promptContainer.className = "healthora-ai-quick-prompts";

    const heading = document.createElement("p");
    heading.className = "healthora-ai-prompts-heading";
    heading.textContent = "✨ Try asking";

    promptContainer.appendChild(heading);

    prompts.forEach(prompt => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "healthora-ai-prompt-button";
        button.textContent = prompt.label;

        button.addEventListener("click", () => {
            if (isSending) return;

            input.value = prompt.question;
            form.requestSubmit();
        });

        promptContainer.appendChild(button);
    });

    messagesContainer.appendChild(promptContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function renderChat(chat) {
    messagesContainer.replaceChildren();

    if (!chat || !chat.messages.length) {
        showWelcomeMessage();
        return;
    }

    chat.messages.forEach(message => {
        addMessage(
            message.text,
            message.role === "user" ? "user" : "assistant"
        );
    });
}

// ==================== TYPING INDICATOR ====================

function showTypingIndicator() {
    const message = document.createElement("div");

    message.id = "healthora-ai-typing";
    message.className = "healthora-ai-message assistant";

    const bubble = document.createElement("div");

    bubble.className =
        "healthora-ai-bubble healthora-ai-typing-bubble";

    bubble.setAttribute("aria-label", "Healthora AI is typing");

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.className = "healthora-ai-typing-dot";
        bubble.appendChild(dot);
    }

    message.appendChild(bubble);
    messagesContainer.appendChild(message);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return message;
}

function removeTypingIndicator(indicator) {
    if (indicator) {
        indicator.remove();
    }
}

// ==================== OPEN / CLOSE CHAT ====================

function setChatOpen(isOpen) {
    panel.classList.toggle("is-open", isOpen);
    panel.setAttribute("aria-hidden", String(!isOpen));
    toggleButton.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
        input.focus();
    }
}

toggleButton.addEventListener("click", () => {
    setChatOpen(!panel.classList.contains("is-open"));
});

closeButton.addEventListener("click", () => {
    setChatOpen(false);
});

// ==================== CHAT HISTORY UI ====================

const historyButton = document.createElement("button");

historyButton.type = "button";
historyButton.textContent = "History";
historyButton.setAttribute("aria-label", "View chat history");

historyButton.style.cssText = `
    border: 1px solid rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.15);
    color: white;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 12px;
`;

if (newChatButton) {
    newChatButton.insertAdjacentElement("afterend", historyButton);
} else {
    const header = document.querySelector(".healthora-ai-header");

    if (header) {
        header.appendChild(historyButton);
    }
}

const historyPanel = document.createElement("div");

historyPanel.setAttribute("aria-label", "Saved conversations");

historyPanel.style.cssText = `
    display: none;
    position: absolute;
    top: 70px;
    right: 12px;
    width: 230px;
    max-width: calc(100% - 24px);
    max-height: 280px;
    overflow-y: auto;
    background: white;
    border: 1px solid #dce7e7;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    z-index: 10002;
`;

const chatHeader = document.querySelector(".healthora-ai-header");

if (chatHeader) {
    chatHeader.style.position = "relative";
    chatHeader.appendChild(historyPanel);
}

function renderHistoryList() {
    historyPanel.replaceChildren();

    const heading = document.createElement("div");

    heading.textContent = "Recent conversations";
    heading.style.cssText = `
        font-weight: 700;
        padding: 7px;
        color: #173b3b;
        font-size: 13px;
    `;

    historyPanel.appendChild(heading);

    const chats = loadChats()
        .filter(
            chat =>
                Array.isArray(chat.messages) &&
                chat.messages.length > 0
        )
        .sort(
            (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
        );

    if (!chats.length) {
        const empty = document.createElement("p");

        empty.textContent = "No saved conversations yet.";
        empty.style.cssText =
            "font-size: 12px; color: #687878; padding: 5px;";

        historyPanel.appendChild(empty);
        return;
    }

    chats.forEach(chat => {
        const item = document.createElement("button");

        item.type = "button";
        item.textContent = chat.title || "New Chat";

        item.style.cssText = `
            display: block;
            width: 100%;
            text-align: left;
            border: none;
            background: ${
                chat.id === activeChat.id ? "#e5f5f1" : "white"
            };
            padding: 10px;
            border-radius: 8px;
            margin-top: 4px;
            cursor: pointer;
            color: #183c3c;
            overflow-wrap: anywhere;
        `;

        item.addEventListener("click", () => {
            if (isSending) return;

            activeChat = chat;

            localStorage.setItem(
                ACTIVE_CHAT_KEY,
                activeChat.id
            );

            renderChat(activeChat);

            historyPanel.style.display = "none";
            input.focus();
        });

        historyPanel.appendChild(item);
    });
}

historyButton.addEventListener("click", () => {
    const isVisible = historyPanel.style.display === "block";

    renderHistoryList();

    historyPanel.style.display = isVisible ? "none" : "block";
});

document.addEventListener("click", event => {
    if (
        !historyPanel.contains(event.target) &&
        !historyButton.contains(event.target)
    ) {
        historyPanel.style.display = "none";
    }
});

// ==================== NEW CHAT ====================

if (newChatButton) {
    newChatButton.addEventListener("click", () => {
        // Invalidate the previous request.
        requestId++;

        // Cancel any pending AI request.
        if (currentRequestController) {
            currentRequestController.abort();
            currentRequestController = null;
        }

        isSending = false;

        input.disabled = false;
        sendButton.disabled = false;
        statusElement.textContent = "";

        // Start a fresh conversation.
        activeChat = createChat();

        renderChat(activeChat);

        input.value = "";
        input.style.height = "auto";

        historyPanel.style.display = "none";

        renderHistoryList();
        input.focus();
    });
}

// ==================== RESTORE SAVED CHAT ====================

renderChat(activeChat);

// ==================== SEND MESSAGE ====================

form.addEventListener("submit", async event => {
    event.preventDefault();

    const message = input.value.trim();

    if (!message || isSending) return;

    isSending = true;

    const thisRequestId = ++requestId;
    const controller = new AbortController();

    currentRequestController = controller;

    // Capture the chat for this request so a new chat
    // cannot receive an older conversation's response.
    const requestChat = activeChat;

    input.disabled = true;
    sendButton.disabled = true;

    statusElement.textContent = "Healthora AI is thinking...";

    requestChat.messages.push({
        role: "user",
        text: message
    });

    if (requestChat.title === "New Chat") {
        requestChat.title =
            message.length > 35
                ? message.slice(0, 35) + "..."
                : message;
    }

    addMessage(message, "user");
    saveActiveChat();

    input.value = "";
    input.style.height = "auto";

    let typingIndicator = null;

    try {
        typingIndicator = showTypingIndicator();

        const history = requestChat.messages
            .slice(0, -1)
            .slice(-10)
            .map(item => ({
                role: item.role === "assistant" ? "model" : "user",
                text: item.text
            }));

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            signal: controller.signal,
            body: JSON.stringify({
                message,
                history
            })
        });

        const data = await response.json();

        // Ignore responses from an older conversation.
        if (thisRequestId !== requestId) return;

        if (!response.ok || !data.success || !data.reply) {
            throw new Error(
                data.message || "Unable to get an AI response."
            );
        }

        requestChat.messages.push({
            role: "assistant",
            text: data.reply
        });

        // Display the answer only in the current chat.
        if (activeChat.id === requestChat.id) {
            addMessage(data.reply, "assistant");
        }

        // Save the exact conversation that received the answer.
        const chats = loadChats();
        const index = chats.findIndex(
            chat => chat.id === requestChat.id
        );

        requestChat.updatedAt = new Date().toISOString();

        if (index !== -1) {
            chats[index] = requestChat;
        } else {
            chats.unshift(requestChat);
        }

        saveChats(chats);
        renderHistoryList();

    } catch (error) {
        if (
            error.name === "AbortError" ||
            thisRequestId !== requestId
        ) {
            return;
        }

        console.error("Healthora AI chat error:", error);

        addMessage(
            "Sorry, I couldn't connect right now. Please check that the Healthora backend is running and try again.",
            "assistant"
        );

    } finally {
        removeTypingIndicator(typingIndicator);

        if (thisRequestId === requestId) {
            isSending = false;
            currentRequestController = null;

            input.disabled = false;
            sendButton.disabled = false;

            statusElement.textContent = "";

            input.focus();
        }
    }
});

// ==================== INPUT BEHAVIOUR ====================

input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
});

input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
    }
});