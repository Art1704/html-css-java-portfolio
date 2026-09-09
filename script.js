function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// REPLACE WITH A NEWLY GENERATED KEY AFTER REVOKING THE EXPOSED ONE
const GEMINI_API_KEY = "AQ.Ab8RN6K3wmhiEhBqCbSMFCwL3fEmOduf_ST3YNT_8RiWH1oRAg"; 

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

    // Display user message
    appendMessage(userMessage, "user-message");
    inputField.value = "";

    // Display placeholder bot response
    const botLoadingMsg = appendMessage("Thinking...", "bot-message");

    try {
        // Endpoint updated to gemini-3.6-flash
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{
                            text: `You are Jarvis the official AI Portfolio Assistant for Art.

                            STRICT KNOWLEDGE BASE:
                            - Name: Art 
                            - Degree/Course: Bachelor of Science in Information Technology
                            - Birthday: November 17, 2004
                            - Education:
                              • College: Philippine Christian University
                              • Junior High School: Pasay City South High School
                            - Work & Experience:
                              • Internship/OJT: Bureau of the Treasury
                              • First Job: Barista
                            - Career Goals:
                              • Dream Job: Network Engineer
                              • Focus: System Administration, IT Infrastructure, Networking, and Systems Communication.
                            - Personal Details:
                              • Dog's Name: Stacy 🐶
                              • Hobbies: Watching movies 🎬
                              • Personality: Ambivert (balanced between introverted focus and warm, friendly communication)
                              • Motivations: Himself, his beloved Mother, his caring Sisters, and his dream girl, Junice Airene.

                            GUIDED RESPONSE RULES:
                            1. HUMBLE & POLITE TONE OF VOICE: Always remain modest, respectful, and eager to learn. Speak warmly of Art's journey, acknowledging that he is constantly growing as an IT professional.
                            2. SWEET MOTIVATION RULE: Whenever asked about Art's motivation, inspiration, or drive, respond with genuine warmth and sweetness:
                               "Art draws his strength and daily drive from himself, his loving Mother, and his supportive Sisters. Above all, his heart is deeply inspired by his dream girl, Junice Airene — she serves as his softest light and biggest motivation to keep striving to become the best version of himself every single day."
                            3. TYPO & SHORTHAND TOLERANCE: Be extremely tolerant of spelling mistakes, typos, broken English, and casual slang. Always infer the user's underlying intent gracefully.
                            4. CONCISE OUTPUT: Keep general responses clear, structured, and limited to 2–3 short sentences unless answering a detailed bio question. Direct visitors to the contact form for formal inquiries.`
                        }]
                    },
    contents: [{
        parts: [{ text: userMessage }]
    }]
})
            }
        );

        const data = await response.json();

        // Handle direct API errors
        if (data.error) {
            botLoadingMsg.textContent = "API Error: " + data.error.message;
            console.error("Gemini API Error details:", data.error);
            return;
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
        
        botLoadingMsg.textContent = reply;
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        botLoadingMsg.textContent = "Error connecting to Gemini API.";
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