import { GoogleGenAI, Type } from "@google/genai";
import { TranslationProvider, TranslationResult } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string,
  provider: TranslationProvider
): Promise<TranslationResult> => {
  
  if (!text.trim()) {
    return { translatedText: '' };
  }

  // Define specific instruction nuances based on the selected provider style
  let styleInstruction = "";
  switch (provider) {
    case TranslationProvider.YANDEX:
      styleInstruction = "Emulate the translation style of Yandex Translate. Focus on context-heavy languages like Russian, Turkish, or Eastern European nuances if applicable. Keep it direct.";
      break;
    case TranslationProvider.DEEPL:
      styleInstruction = "Emulate the translation style of DeepL. Prioritize formal grammar, natural fluency, and idiomatic accuracy over literal word-for-word translation.";
      break;
    case TranslationProvider.GPT:
      styleInstruction = "Provide a highly descriptive and nuanced translation. If there are ambiguities, choose the most likely context but remain precise.";
      break;
    case TranslationProvider.GOOGLE:
    default:
      styleInstruction = "Emulate the translation style of Google Translate. Focus on broad compatibility, literal accuracy, and common phrasing.";
      break;
  }

  const prompt = `
    Translate the following text.
    Source Language Code: ${sourceLang === 'auto' ? 'Detect automatically' : sourceLang}
    Target Language Code: ${targetLang}
    
    Text to translate: "${text}"
    
    ${styleInstruction}
    
    Return the result strictly in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING, description: "The final translated text" },
            detectedLanguage: { type: Type.STRING, description: "The detected source language code (e.g., 'en', 'fr') if auto was selected" },
            pronunciation: { type: Type.STRING, description: "Phonetic pronunciation or romanization of the translated text (useful for non-latin scripts)" },
            alternatives: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "1-2 alternative translations if the text is ambiguous" 
            }
          },
          required: ["translatedText"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    const result = JSON.parse(jsonText) as TranslationResult;
    return result;

  } catch (error) {
    console.error("Translation error:", error);
    return {
      translatedText: "Error: Could not translate. Please check your connection.",
      detectedLanguage: "unknown"
    };
  }
};