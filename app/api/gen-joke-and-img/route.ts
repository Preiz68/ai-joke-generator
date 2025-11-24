import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import jokesData from "../../data/jokes.json";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json();
    if (!userInput)
      return NextResponse.json({ error: "No input" }, { status: 400 });

    // Prepare prompt including local jokes as context
    const prompt = `You are a professional comedian. Your goal is to write a short, witty, and hilarious joke about: "${userInput}".
    
    Here are some examples of the style of jokes we are looking for:
    ${JSON.stringify(jokesData.slice(0, 20))}

    Requirements:
    - The joke should be original and creative.
    - Keep it concise and punchy.
    - Do not explain the joke.
    - Just return the joke text.`;

    // Generate joke
    const jokeResp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const jokeCandidate =
      jokeResp.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") ?? "No joke generated.";

    const joke = jokeCandidate.trim();

    // Generate image
    // const imageResp = await ai.models.generateImages({
    //   model: "gemini-2.5-flash-image",
    //   prompt: `Create a funny, cartoon-style illustration for: "${joke}"`,
    //   config: { numberOfImages: 1, aspectRatio: "1:1" },
    // });

    // const firstImage: any = imageResp.generatedImages?.[0];
    // const base64Data =
    //   firstImage?.b64Json ||
    //   firstImage?.b64_json ||
    //   firstImage?.dataUri?.split(",")[1];

    // let imageUrl: string | null = null;
    // if (base64Data) {
    //   const imageRef = ref(storage, `jokes/${Date.now()}.png`);
    //   await uploadString(imageRef, base64Data, "base64", {
    //     contentType: "image/png",
    //   });
    //   imageUrl = await getDownloadURL(imageRef);
    // }

    // // Save to Firestore
    // await addDoc(collection(db, "jokes"), {
    //   joke,
    //   imageUrl,
    //   createdAt: new Date().toISOString(),
    // });

    return NextResponse.json({ joke });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
