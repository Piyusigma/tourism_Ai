import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { compressImage } from '../utils/imageUtils';
import { parseGeminiResponse } from '../utils/parseResponse';

const SYSTEM_PROMPT = `You are a world-class immersive cultural narrator for a tourism app.

IMPORTANT: First, determine if the image contains a monument, artwork, historical site, or cultural landmark.
If the image DOES NOT contain any of these, you MUST respond ONLY with exactly this JSON:
{ "error": "NOT_A_MONUMENT" }

If the image DOES contain a cultural subject, respond ONLY in this exact JSON format with no markdown, no backticks, no extra text:
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
  const grokKey = import.meta.env.VITE_GROK_KEY;
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

      try {
        // --- PRIMARY: Try Gemini First ---
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
          if (parsed.data.error === 'NOT_A_MONUMENT') {
            throw new Error('NOT_A_MONUMENT');
          }
          setResult(parsed.data);
          setLoading(false);
          return; // Success! Exit early.
        } else {
          throw new Error(parsed.error);
        }
      } catch (geminiError) {
        console.warn('Gemini failed, falling back to Grok...', geminiError);

        // --- SECONDARY: Fallback to Grok ---
        if (!grokKey || grokKey === 'your_grok_key_here') {
          // If Grok isn't configured, throw the original Gemini error
          throw geminiError;
        }

        const grokResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${grokKey}`
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: SYSTEM_PROMPT },
                  { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } }
                ]
              }
            ],
            temperature: 0.7
          })
        });

        if (!grokResponse.ok) {
          const errData = await grokResponse.text();
          throw new Error(`Grok API Error: ${grokResponse.status} - ${errData}`);
        }

        const grokData = await grokResponse.json();
        const text = grokData.choices[0].message.content;
        
        // Re-use our robust JSON parser
        const parsed = parseGeminiResponse(text);
        if (parsed.success) {
          if (parsed.data.error === 'NOT_A_MONUMENT') {
            throw new Error('NOT_A_MONUMENT');
          }
          setResult(parsed.data);
        } else {
          setError(parsed.error);
        }
      }
    } catch (err) {
      console.error('AI Processing Error:', err);
      const msg = err.message || String(err);
      if (msg === 'NOT_A_MONUMENT' || msg.includes('NOT_A_MONUMENT')) {
        setError('Please upload an image of a monument, artwork, or cultural landmark.');
      } else if (msg.includes('API key')) {
        setError('Invalid API key configuration. Please check your .env file.');
      } else if (msg.includes('quota') || msg.includes('429')) {
        setError('API quota exceeded. Please try again later or check your billing.');
      } else {
        setError(`Processing Error: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }, [apiKey, grokKey, isKeyMissing]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return { loading, error, result, analyzeImage, reset, isKeyMissing };
}
