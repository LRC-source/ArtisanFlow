

/**
 * Lola AI Architect - High Velocity & Deep Thinking Node (v1.4 - Server + Client Fallback)
 * Primary path: POST /api/gemini (Vercel serverless, uses GEMINI_API_KEY)
 * Fallback path: direct @google/genai SDK (uses VITE_GEMINI_API_KEY, runs in browser)
 */
import { auth } from './firebase';

export const chatWithLola = async (message: string, context?: any, mode: 'fast' | 'deep' | 'search' = 'fast') => { 
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();

      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const response = await fetch('/api/gemini', { signal: controller.signal,
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action: 'chatWithLola', payload: { message, context, mode } })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const data = await response.json();
      return { text: data.error || "Server error", isError: true, followUpQuestions: [] };
    }
  } catch (error: any) {
    return { text: error.message || "Failed to reach Lola.", isError: true, followUpQuestions: [] };
  }
};

/**
 * Visual Analysis Node - Gemini 3 Pro Vision
 */
export const analyzeLolaImage = async (imageB64: string, prompt: string) => {
  try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const response = await fetch('/api/gemini', { signal: controller.signal,
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
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const response = await fetch('/api/gemini', { signal: controller.signal,
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
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const response = await fetch('/api/gemini', { signal: controller.signal,
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
  try { return parseAIJson(result.text); } catch (e) { return null; }
};

export const generateMarketingStrategy = async (pulseData: string, tier: string) => {
  const result = await chatWithLola(`Generate marketing strategy. PULSE: ${pulseData} TIER: ${tier}`, null, 'deep');
  return result.text;
};

const parseAIJson = (text: string) => { 
  try { 
      let clean = text;
      const match = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (match) clean = match[1];
      return JSON.parse(clean.trim()); 
  } catch(e) { 
      return null; 
  } 
};
export const generatePlatformContentBundle = async (strategy: any) => {
    let lastError = "";
    for (let i = 0; i < 3; i++) {
        const result = await chatWithLola("Synthesize posts. Format as a JSON object with a 'posts' array. ONLY output the raw JSON.", strategy, 'fast');
        if (result.isError) {
            lastError = result.text || "Unknown AI Error";
            continue;
        }
        const parsed = parseAIJson(result.text);
        if (parsed && parsed.posts) {
            return parsed;
        }
        lastError = "AI returned malformed JSON.";
    }
    throw new Error("Synthesis failed: " + lastError);
};

export const generateFinancialAnalysis = async (orders: any[], inventory: any[]) => {
  const result = await chatWithLola("Generate 5-year recovery projection.", { orders, inventory }, 'deep');
  try { return parseAIJson(result.text); } catch (e) { return null; }
};

export const generateBudgetStrategy = async (rev: number, exp: number, goals: string) => {
  const result = await chatWithLola(`Optimize budget. Rev: ${rev} Exp: ${exp} Goals: ${goals}`, null, 'deep');
  try { return parseAIJson(result.text); } catch (e) { return null; }
};

