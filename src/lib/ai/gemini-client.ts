import { isValidAIResponse, type AIMentorResponse } from './response-types';
import { cleanJSONResponse } from '@/app/api/mentor/parsers';

export interface GeminiConfig {
  apiKey: string;
  model: string;
  timeout?: number;
  maxTokens?: number;
}

export interface GeminiError {
  type: 'rate_limit' | 'network' | 'parse' | 'api' | 'missing_key';
  message: string;
  statusCode?: number;
}

export async function callGeminiAPI(
  prompt: string,
  responseType: string,
  config?: Partial<GeminiConfig>
): Promise<AIMentorResponse> {
  const apiKey = config?.apiKey || process.env.GEMINI_API_KEY;
  const model = config?.model || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const timeout = config?.timeout || 30000;
  const maxTokens = config?.maxTokens || 2048;

  if (!apiKey) {
    throw { type: 'missing_key', message: 'GEMINI_API_KEY not configured' };
  }

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: maxTokens,
            responseMimeType: 'application/json',
          },
          systemInstruction: {
            parts: [{ text: 'You are a helpful assistant that responds in JSON format only.' }],
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const duration = Date.now() - startTime;
    console.log(`[AI] Gemini request completed in ${duration}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      const statusCode = response.status;

      if (statusCode === 429) {
        throw { type: 'rate_limit', message: 'Rate limit exceeded', statusCode };
      }

      if (statusCode >= 500) {
        throw { type: 'api', message: `Gemini API error: ${statusCode}`, statusCode };
      }

      throw { type: 'api', message: `API error: ${errorText}`, statusCode };
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw { type: 'parse', message: 'No content in Gemini response' };
    }

    const cleanedText = cleanJSONResponse(generatedText);
    const parsed = JSON.parse(cleanedText) as AIMentorResponse;

    if (!isValidAIResponse(parsed)) {
      console.warn('[AI] Invalid response structure from Gemini');
      throw { type: 'parse', message: 'Invalid response structure' };
    }

    return parsed;
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error as GeminiError;

    if (err.type === 'missing_key') {
      console.warn(`[AI] ${err.message}`);
      throw error;
    }

    console.error(`[AI] Gemini error after ${duration}ms:`, err.message);
    throw error;
  }
}

export async function callGeminiWithFallback(
  prompt: string,
  responseType: string,
  fallback: () => AIMentorResponse,
  config?: Partial<GeminiConfig>
): Promise<{ response: AIMentorResponse; fallbackUsed: boolean }> {
  try {
    const response = await callGeminiAPI(prompt, responseType, config);
    return { response, fallbackUsed: false };
  } catch {
    console.warn('[AI] Gemini call failed, using fallback');

    const fallbackResponse = fallback();
    return { response: fallbackResponse, fallbackUsed: true };
  }
}

export function createGeminiError(error: unknown): GeminiError {
  if (typeof error === 'object' && error !== null && 'type' in error) {
    return error as GeminiError;
  }

  const message = error instanceof Error ? error.message : 'Unknown error';

  if (message.includes('fetch') || message.includes('abort')) {
    return { type: 'network', message: 'Network error or timeout' };
  }

  if (message.includes('JSON')) {
    return { type: 'parse', message: 'Failed to parse response' };
  }

  return { type: 'api', message };
}