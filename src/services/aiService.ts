import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getHealthTip(habits: string[]) {
  if (!process.env.GEMINI_API_KEY) return "Stay consistent and keep growing!";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is tracking these habits: ${habits.join(", ")}. 
      Give a short, punchy motivational tip or health insight (max 15 words). 
      Make it feel like a professional performance coach.`,
    });
    return response.text || "One step at a time.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Keep up the great work!";
  }
}

export async function suggestHabits(goal: string) {
  if (!process.env.GEMINI_API_KEY) return ["Drink water", "Read 10 mins", "Meditation"];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User wants to: ${goal}. 
      Suggest 3 specific, actionable daily habits to achieve this. 
      Format: comma separated list.`,
    });
    return response.text?.split(",").map(s => s.trim()) || [];
  } catch (error) {
    return ["Drink water", "Read 10 mins", "Meditation"];
  }
}
