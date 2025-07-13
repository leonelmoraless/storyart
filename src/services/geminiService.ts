import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY not set. Using mock data.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

const generateMockDialogues = async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
        "Los vientos del norte susurran secretos antiguos.",
        "No podemos quedarnos aquí, la sombra se acerca.",
        "¿Sientes eso? Es el poder que emana del artefacto."
    ];
};

export const generateDialogue = async (sceneSummary: string): Promise<string[]> => {
    if (!GEMINI_API_KEY || !sceneSummary.trim()) return generateMockDialogues();

    const prompt = `Basado en el siguiente resumen de una escena de novela visual, genera 3 opciones de diálogo o texto narrativo. El resumen es: "${sceneSummary}".

Responde únicamente con un JSON válido en el siguiente formato:
{
  "dialogues": [
    "Opción de diálogo 1",
    "Opción de diálogo 2", 
    "Opción de diálogo 3"
  ]
}`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            const parsed = JSON.parse(jsonStr);
            return parsed.dialogues || [];
        }
        
        return generateMockDialogues();
    } catch (error) {
        console.error("Error generating dialogue with Gemini:", error);
        return generateMockDialogues();
    }
};