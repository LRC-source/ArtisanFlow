/**
 * Lola AI Architect - High Velocity & Deep Thinking Node (v1.3 Multiplexed)
 */
export const chatWithLola = async (message: string, context?: any, mode: 'fast' | 'deep' | 'search' = 'fast') => { 
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'chatWithLola', payload: { message, context, mode } })
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Lola Node Error:", error);
    return { text: "Node communication error. Verify API connection.", isError: true, followUpQuestions: [] };
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