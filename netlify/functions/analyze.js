import { GoogleGenerativeAI } from "@google/generative-ai";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { projectDescription } = JSON.parse(event.body || "{}");

    if (!projectDescription || projectDescription.trim().length < 10) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Project description is too short." })
      };
    }

    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing Gemini API key." })
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are AI Scout Lite, a brutally honest but helpful hackathon evaluator.

Analyze this AI tool, startup idea, or GitHub project description:

"${projectDescription}"

Return ONLY valid JSON. No markdown. No explanation outside JSON.

Use this exact JSON structure:
{
  "summary": "short summary",
  "who_it_helps": "who benefits from this",
  "weaknesses": "main weaknesses or risks",
  "usefulness_score": number from 0 to 25,
  "originality_score": number from 0 to 25,
  "technical_potential_score": number from 0 to 25,
  "beginner_value_score": number from 0 to 25,
  "total_scout_score": number from 0 to 100,
  "verdict": "TRY or WATCH or SKIP",
  "next_step": "best next step for the user"
}

Scoring rules:
- Be realistic, not overly nice.
- total_scout_score must equal the four category scores added together.
- Use TRY for strong ideas, WATCH for promising but unclear ideas, SKIP for weak ideas.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleaned);

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Analyze function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to analyze project.",
        details: error.message
      })
    };
  }
}