function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

function toggleChat() {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.classList.toggle("chat-hidden");
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userMessage = inputField.value.trim();

    if (!userMessage) return;

    appendMessage(userMessage, "user-message");
    inputField.value = "";

    const botLoadingMsg = appendMessage("Thinking...", "bot-message");

    try {
        const response = await fetch("/.netlify/functions/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        if (data.error) {
            botLoadingMsg.textContent = "Error: " + (data.error.message || data.error);
            return;
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
        
        botLoadingMsg.textContent = reply;
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        botLoadingMsg.textContent = "Error connecting to Jarvis service.";
        console.error("Fetch Exception:", error);
    }
}

function appendMessage(text, className) {
    const chatBox = document.getElementById("chat-box");
    const msgElement = document.createElement("div");
    msgElement.classList.add("message", className);
    msgElement.textContent = text;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgElement;
}