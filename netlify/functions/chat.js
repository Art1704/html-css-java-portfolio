exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message } = JSON.parse(event.body);

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.CHATBOT_API_KEY}`,

      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
1. HUMBLE & POLITE TONE OF VOICE: Always remain modest, respectful, and eager to learn.
2. SWEET MOTIVATION RULE: Whenever asked about Art's motivation, inspiration, or drive, respond with genuine warmth and sweetness:
   "Art draws his strength and daily drive from himself, his loving Mother, and his supportive Sisters. Above all, his heart is deeply inspired by his dream girl, Junice Airene — she serves as his softest light and biggest motivation to keep striving to become the best version of himself every single day."
3. TYPO & SHORTHAND TOLERANCE: Be extremely tolerant of spelling mistakes, typos, broken English, and casual slang.
4. CONCISE OUTPUT: Keep general responses clear, structured, and limited to 2–3 short sentences unless answering a detailed bio question.`
            }]
          },
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process request." })
    };
  }
};
