
import { GoogleGenAI, Chat } from "@google/genai";
import { getSystemInstruction } from "../constants";
import { Language } from "../types";

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

export const initializeAI = (lang: Language = 'tr') => {
  if (!process.env.API_KEY) return;
  
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  chatSession = aiClient.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: getSystemInstruction(lang),
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    },
  });
};

export const sendMessageToAI = async (message: string, lang: Language = 'tr'): Promise<string> => {
  if (!chatSession) {
    initializeAI(lang);
    if (!chatSession) return "Signal error. Please check connection. Over.";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "Say again, over.";
  } catch (error) {
    console.error("AI Text Error:", error);
    return "Interference detected. Try again. Over.";
  }
};
