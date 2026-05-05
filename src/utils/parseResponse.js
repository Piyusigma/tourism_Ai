/**
 * Parse the Gemini API response text into a structured object.
 * Handles potential markdown code fences and extraneous text.
 *
 * @param {string} text - Raw text response from Gemini
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export function parseGeminiResponse(text) {
  try {
    // Strip markdown code fences if present
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');
    cleaned = cleaned.trim();

    // Try to find JSON object in the response
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      return {
        success: false,
        error: "We couldn't find a cultural site in this image. Try a monument, museum, temple, or landmark.",
      };
    }

    const jsonStr = cleaned.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonStr);

    // Validate required fields
    if (!data.name || !data.location || !data.narration) {
      return {
        success: false,
        error: "We couldn't find a cultural site in this image. Try a monument, museum, temple, or landmark.",
      };
    }

    // Ensure arrays exist
    data.funFacts = data.funFacts || [];
    data.timeline = data.timeline || [];
    data.hindiNarration = data.hindiNarration || data.narration;
    data.bengaliNarration = data.bengaliNarration || data.narration;

    return { success: true, data };
  } catch (err) {
    console.error('Parse error:', err);
    return {
      success: false,
      error: "We couldn't find a cultural site in this image. Try a monument, museum, temple, or landmark.",
    };
  }
}
