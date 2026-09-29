const GEMINI_API_URL =
 "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

async function generateHealthResponse(message, history = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  if (typeof message !== "string" || !message.trim()) {
    throw new Error("A valid message is required.");
  }

  const contents = [
    ...history
      .filter(
        (item) =>
          ["user", "model"].includes(item.role) &&
          typeof item.text === "string"
      )
      .slice(-10)
      .map((item) => ({
        role: item.role,
        parts: [{ text: item.text }],
      })),

    {
      role: "user",
      parts: [{ text: message.trim() }],
    },
  ];

  let response;

  // Retry temporary server and rate-limit errors up to 3 attempts.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      response = await fetch(
        `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text:
                    "You are Healthora's health and wellness assistant. " +
                    "Provide clear, evidence-aware general health education. " +
                    "Do not diagnose diseases, prescribe medicines, or claim " +
                    "to replace a qualified healthcare professional. " +
                    "For emergencies, advise contacting local emergency " +
                    "services. Use simple, friendly language.",
                },
              ],
            },
            contents,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 800,
            },
          }),
        }
      );
    } catch (error) {
      console.error("Gemini network error:", error.message);

      if (attempt === 2) {
        throw new Error("Could not connect to the Gemini API.");
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 1500 * (attempt + 1))
      );

      continue;
    }

    // Retry only temporary errors.
    if (
      response.status !== 503 &&
      response.status !== 429 &&
      response.status < 500
    ) {
      break;
    }

    if (attempt < 2) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1500 * (attempt + 1))
      );
    }
  }

  if (!response || !response.ok) {
    const errorData = response
      ? await response.json().catch(() => ({}))
      : {};

    console.error(
      "Gemini API error:",
      response?.status || "Network error",
      errorData.error?.message || "Unknown error"
    );

    throw new Error("The AI service is temporarily unavailable.");
  }

  const data = await response.json();

  const answer = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!answer) {
    throw new Error("The AI could not generate a response.");
  }

  return answer;
}

module.exports = { generateHealthResponse };