import fetch from "node-fetch";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
const SITE_TITLE = process.env.SITE_TITLE || "LMS Platform";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-r1:free";

/**
 * Cleans AI output and safely parses JSON
 */
function safeJsonParse(str) {
  try {
    // Remove markdown code fences like ```json ... ```
    let cleaned = str.trim()
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Failed to parse AI JSON:", err.message);
    throw new Error("Invalid AI response format");
  }
}

async function callDeepSeek(prompt) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": SITE_TITLE,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an AI tutor. When asked for quizzes or flashcards, return ONLY valid JSON without any explanation."
        },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("DeepSeek API error:", errorText);
    throw new Error("Failed to generate response from DeepSeek AI");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export const generateAIQuiz = async (lesson) => {
  const prompt = `
Generate exactly 5 multiple-choice questions in pure JSON array:
[{"question":"","options":["",""],"answer":"","difficulty":"easy","topics":["topic1"]}]
Lesson Title: ${lesson.title}
Lesson Description: ${lesson.description || ""}
  `;
  const output = await callDeepSeek(prompt);
  return safeJsonParse(output);
};

export const generateAISummary = async (lesson) => {
  const prompt = `
Write a short and clear summary of this lesson in plain text.
Lesson Title: ${lesson.title}
Lesson Description: ${lesson.description || ""}
  `;
  const output = await callDeepSeek(prompt);
  return output;
};

// export const generateAIFlashcards = async (lesson) => {
//   const prompt = `
// Generate 5 flashcards in pure JSON:
// [{"front":"Front text","back":"Back text"}]
// Lesson Title: ${lesson.title}
// Lesson Description: ${lesson.description || ""}
//   `;
//   const output = await callDeepSeek(prompt);
//   return safeJsonParse(output);
// };
