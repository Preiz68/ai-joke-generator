import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import jokesData from "../../data/jokes_500.json";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userInput, category } = body;

    // Allow generation if either userInput OR category is present
    if (!userInput && !category) {
      return NextResponse.json(
        { error: "Please provide a topic or select a category." },
        { status: 400 }
      );
    }

    const targetCategory = category || "Funny";

    // --- Filter jokes by category ---
    const filtered = category
      ? jokesData.filter(
          (j) => j.category.toLowerCase() === category.toLowerCase()
        )
      : jokesData;

    if (filtered.length === 0) {
      console.log("⚠️ No jokes found in that category");
    }

    // Pick random 6 examples
    const examples = filtered.sort(() => Math.random() - 0.5).slice(0, 6);

    const examplesText = examples.map((j) => `- ${j.output}`).join("\n");

    // Build prompt
    const prompt = `
You are a world-class comedian.

Task:
Write a NEW joke about: "${userInput || "a random topic"}"

Category: ${targetCategory}

Here are example jokes in this category.  
Match their tone, cleverness, and style — but DO NOT copy them:

${examplesText}

Rules:
- Joke must be original.
- Keep it short (1-3 sentences).
- Must be funny and clever.
- No explanations. Just the joke.
`;

    const jokeResp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const jokeCandidate =
      jokeResp.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") ?? "No joke generated.";

    const joke = jokeCandidate.trim();

    return NextResponse.json({ joke });
  } catch (err) {
    console.error("ERROR in joke generator:", err);
    return NextResponse.json(
      { error: "Failed to generate joke" },
      { status: 500 }
    );
  }
}
