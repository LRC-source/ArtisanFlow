import { GoogleGenAI } from '@google/genai';

/**
 * Lola AI Architect - High Velocity & Deep Thinking Node (v1.4 - Server + Client Fallback)
 * Primary path: POST /api/gemini (Vercel serverless, uses GEMINI_API_KEY)
 * Fallback path: direct @google/genai SDK (uses VITE_GEMINI_API_KEY, runs in browser)
 */
export const chatWithLola = async (message: string, context?: any, mode: 'fast' | 'deep' | 'search' = 'fast') => { 
  // ── Primary: Vercel serverless route ──────────────────────────────────────
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'chatWithLola', payload: { message, context, mode } })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (!data.isError) return data;
    }
  } catch (_) {
    // Server route unavailable — fall through to client-side SDK
  }

  // ── Fallback: direct SDK via VITE_GEMINI_API_KEY ──────────────────────────
  const clientKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!clientKey) {
    return { 
      text: "Lola is offline — GEMINI_API_KEY is not configured on this deployment. Add it in Vercel → Settings → Environment Variables.", 
      isError: true, 
      followUpQuestions: [] 
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: clientKey });
    const modelName = mode === 'deep' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const systemPrompt = `You are Lola, a world-class Senior AI Architect for the Artisan Flow platform.
MODE: ${mode.toUpperCase()}
${mode === 'deep' ? 'Engage deep architectural reasoning.' : ''}
SNAPSHOT: ${JSON.stringify(context || {}, null, 2)}
LOGIC PROTOCOLS:
1. Authoritative, data-driven, concise.
2. No asterisks (*). Use hyphens (-) for lists.
3. Return JSON: { "text": "...", "followUpQuestions": ["...", "..."], "suggestedRoute": "..." }`;

    const result = await ai.models.generateContent({
      model: modelName as any,
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(result.text || '{}');
    return {
      text: parsed.text || 'Analyzing your data...',
      followUpQuestions: parsed.followUpQuestions || [],
      suggestedRoute: parsed.suggestedRoute || null,
      isError: false,
    };
  } catch (err: any) {
    console.error('Lola SDK fallback error:', err);
    return { 
      text: "I'm having trouble connecting right now. Please verify your connection.", 
      isError: true, 
      followUpQuestions: [] 
    };
  }
};



/**
 * Visual Analysis Node - Gemini 3 Pro Vision
 */
export const analyzeLolaImage = async (imageB64: string, prompt: string) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'analyzeLolaImage', payload: { imageB64, prompt } })
    });
    const data = await response.json();
    return data.text || "Failed to analyze visual asset.";
  } catch (e) {
    console.error("Visual Analysis Error:", e);
    return "Failed to analyze visual asset.";
  }
};

/**
 * Image Synthesis Node - Gemini 3 Pro Image (Nano Banana Pro)
 */
export const generateLolaImage = async (prompt: string, config: { size: '1K' | '2K' | '4K', aspectRatio: string }) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generateLolaImage', payload: { prompt, config } })
    });
    const data = await response.json();
    return data.image || null;
  } catch (e) {
    console.error("Image Generation Error:", e);
    throw e;
  }
};

/**
 * Lola Text-to-Speech - High-Fidelity Audio Synthesis
 */
export const generateLolaSpeech = async (text: string) => {
  if (!text) return null;
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generateLolaSpeech', payload: { text } })
    });
    const data = await response.json();
    return data.audio || null;
  } catch (error) {
    console.error("Lola TTS Error:", error);
    return null;
  }
};

export const searchBusinessData = async (query: string, data: any) => {
  return (await chatWithLola(query, data, 'fast')).text;
};

export const analyzeBudgetGuard = async (context: any) => {
  const result = await chatWithLola("Generate strategic budget proposal.", context, 'deep');
  try { return JSON.parse(result.text); } catch (e) { return null; }
};

export const generateMarketingStrategy = async (pulseData: string, tier: string) => {
  const result = await chatWithLola(`Generate marketing strategy. PULSE: ${pulseData} TIER: ${tier}`, null, 'deep');
  return result.text;
};

export const generatePlatformContentBundle = async (strategy: any) => {
  const result = await chatWithLola("Synthesize posts.", strategy, 'fast');
  try { return JSON.parse(result.text); } catch (e) { return null; }
};

export const generateFinancialAnalysis = async (orders: any[], inventory: any[]) => {
  const result = await chatWithLola("Generate 5-year recovery projection.", { orders, inventory }, 'deep');
  try { return JSON.parse(result.text); } catch (e) { return null; }
};

export const generateBudgetStrategy = async (rev: number, exp: number, goals: string) => {
  const result = await chatWithLola(`Optimize budget. Rev: ${rev} Exp: ${exp} Goals: ${goals}`, null, 'deep');
  try { return JSON.parse(result.text); } catch (e) { return null; }
};