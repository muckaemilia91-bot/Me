import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateDailyChallenge = async (mood?: string) => {
  try {
    const prompt = mood 
      ? `Generate a tiny daily self-care challenge for someone feeling ${mood}. Keep it short and actionable. Translate the output to Albanian language.`
      : `Generate a tiny daily self-care challenge to inspire mindfulness and growth. Keep it short and actionable. Translate the output to Albanian language.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["title", "description"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating challenge:", error);
    return {
      title: "Frymëmarrje e thellë",
      description: "Merrni 5 frymëmarrje të thella dhe përqendrohuni në momentin e tanishëm.",
      category: "Ndërgjegjësim"
    };
  }
};

export const getMoodInsight = async (entryContent: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this diary entry: "${entryContent}", provide a short, supportive, and insightful reflection (max 2 sentences). Translate the output to Albanian language.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting insight:", error);
    return "Faleminderit që ndatë mendimet tuaja sot për të vazhduar rritjen.";
  }
};
