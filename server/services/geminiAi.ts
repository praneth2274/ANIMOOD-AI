import { GoogleGenAI } from '@google/genai';
import { ContentItem, RecommendationRequest } from '../types.js';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateAiExplanation(
  item: ContentItem,
  request: RecommendationRequest
): Promise<string> {
  const fallback = `You selected ${request.mood} + ${request.situation} + ${request.state}. ${item.title} (${item.contentType.toUpperCase()}) matches because its ${item.genres.slice(0, 3).join(', ')} storytelling and compelling pace resonate with your current mood.`;

  try {
    const ai = getAiClient();
    if (!ai) {
      return fallback;
    }

    const prompt = `You are AniMood AI, an entertainment curator.
A user has provided their current preferences:
- Mood: ${request.mood}
- Situation: ${request.situation}
- State/Energy: ${request.state}
- Requested Genres: ${request.genres.join(', ') || 'Any'}
- Language: ${request.language}

The recommended title is:
- Title: ${item.title}
- Content Type: ${item.contentType} (${item.country})
- Genres: ${item.genres.join(', ')}
- Synopsis: ${item.description}

Write a short, engaging 1-to-2 sentence personalized explanation of why this specific title is the perfect watch or read for them right now.
Rules:
1. Keep it under 45 words.
2. Focus purely on entertainment value, art style, pacing, and emotional tone.
3. Strictly DO NOT make medical, clinical, or psychological diagnoses. Mood is strictly an entertainment preference.`;

    const aiCall = (async () => {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            temperature: 0.7,
          },
        });
        return response.text?.trim() || fallback;
      } catch (e) {
        // Fallback to gemini-2.0-flash-lite if needed
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-lite',
            contents: prompt,
            config: {
              temperature: 0.7,
            },
          });
          return response.text?.trim() || fallback;
        } catch (innerErr) {
          return fallback;
        }
      }
    })();

    const timeoutPromise = new Promise<string>((resolve) => {
      setTimeout(() => resolve(fallback), 8000);
    });

    return await Promise.race([aiCall, timeoutPromise]);
  } catch (err) {
    console.warn('Gemini AI explanation fallback triggered:', err);
    return fallback;
  }
}
