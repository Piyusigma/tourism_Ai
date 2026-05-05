import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { compressImage } from '../utils/imageUtils';
import { parseGeminiResponse } from '../utils/parseResponse';

const SYSTEM_PROMPT = `You are a world-class immersive cultural narrator for a tourism app. Analyze the image and respond ONLY in this exact JSON format with no markdown, no backticks, no extra text:
{
  "name": "Monument or place name",
  "location": "City, Country",
  "narration": "Three paragraphs of cinematic, emotional, immersive narration about this place. Write like a movie narrator — evocative, dramatic, inspiring. Minimum 200 words.",
  "funFacts": ["fact 1", "fact 2", "fact 3"],
  "timeline": [
    {"year": "year", "event": "what happened"},
    {"year": "year", "event": "what happened"},
    {"year": "year", "event": "what happened"}
  ],
  "hindiNarration": "Same narration translated to Hindi",
  "bengaliNarration": "Same narration translated to Bengali"
}`;

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  const isKeyMissing = !apiKey || apiKey === 'your_gemini_api_key_here';

  const analyzeImage = useCallback(async (file) => {
    if (isKeyMissing) {
      setError('API key is not configured. Please add your Gemini API key to the .env file as VITE_GEMINI_KEY.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Compress image
      const { base64, mimeType } = await compressImage(file);

      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Send request
      const response = await model.generateContent([
        SYSTEM_PROMPT,
        {
          inlineData: {
            data: base64,
            mimeType,
          },
        },
      ]);

      const text = response.response.text();
      const parsed = parseGeminiResponse(text);

      if (parsed.success) {
        setResult(parsed.data);
      } else {
        setError(parsed.error);
      }
    } catch (err) {
      console.error('Gemini API Error:', err);
      const msg = err.message || String(err);
      if (msg.includes('API key')) {
        setError('Invalid API key. Please check your VITE_GEMINI_KEY in the .env file.');
      } else if (msg.includes('quota') || msg.includes('429')) {
        setError('API quota exceeded. Please try again later or check your Google Cloud billing.');
      } else {
        setError(`API Error: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }, [apiKey, isKeyMissing]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return { loading, error, result, analyzeImage, reset, isKeyMissing };
}
