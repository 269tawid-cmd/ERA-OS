import { isValidAIResponse, type ParsedAIResponse } from '@/lib/ai/response-types';

export function parseAIResponse(rawText: string, expectedType: string): ParsedAIResponse {
  try {
    const parsed = JSON.parse(rawText);

    if (isValidAIResponse(parsed)) {
      if (parsed.type !== expectedType) {
        console.warn(`[AI] Response type mismatch: expected ${expectedType}, got ${parsed.type}`);
      }
      return {
        success: true,
        data: parsed,
      };
    }

    return {
      success: false,
      error: 'Invalid response structure',
      fallback_used: true,
    };
  } catch (parseError) {
    console.error('[AI] JSON parse error:', parseError);
    return {
      success: false,
      error: 'Failed to parse AI response',
      fallback_used: true,
    };
  }
}

export function extractJSONFromText(text: string): string | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : null;
}

export function cleanJSONResponse(text: string): string {
  const trimmed = text.trim();
  
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }

  const extracted = extractJSONFromText(trimmed);
  return extracted || trimmed;
}