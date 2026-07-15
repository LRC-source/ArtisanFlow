import { GoogleGenAI, Type, Modality } from "@google/genai";

/**
 * Lola AI Architect - High Velocity & Deep Thinking Node (v1.3 Multiplexed)
 */
export const chatWithLola = async (message: string, context?: any, mode: 'fast' | 'deep' | 'search' = 'fast') => { 
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Select model based on requested cognitive mode
    let model = 'gemini-2.5-flash-lite-latest'; // Fast (default)
    let config: any = { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          followUpQuestions: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          suggestedRoute: { type: Type.STRING }
        },
        required: ["text", "followUpQuestions"]
      }
    };

    if (mode === 'deep') {
      model = 'gemini-3-pro-preview';
      config.thinkingConfig = { thinkingBudget: 32768 };
    } else if (mode === 'search') {
      model = 'gemini-3-flash-preview';
      config.tools = [{ googleSearch: {} }];
    }

    const systemPrompt = `
      You are Lola, a world-class Senior AI Architect for the Artisan Flow platform.
      You have real-time read access to the manufacturing database and integration nodes.
      
      MODE: ${mode.toUpperCase()}
      ${mode === 'search' ? 'Use Google Search to find up-to-date market trends, competitor pricing, or industry news.' : ''}
      ${mode === 'deep' ? 'Engage deep architectural reasoning to solve complex supply chain or financial optimization problems.' : ''}

      VALID ROUTES:
      - /inventory, /operations/orders, /marketing, /recipes, /finance, /lola/todos, /settings/integrations
      
      SNAPSHOT:
      ${JSON.stringify(context || {}, null, 2)}
      
      LOGIC PROTOCOLS:
      1. Authoritative, data-driven, concise.
      2. No asterisks (*). Use hyphens (-) for lists.
      3. Return JSON with text, followUpQuestions (2-3), and suggestedRoute (optional).
      ${mode === 'search' ? '4. If using search grounding, reference findings naturally.' : ''}
    `;

    const response = await ai.models.generateContent({
      model: model as any,
      contents: message,
      config: { 
        ...config,
        systemInstruction: systemPrompt,
      },
    });

    // If search mode, check for grounding metadata
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    try {
        const parsed = JSON.parse(response.text || "{}");
        let text = parsed.text || "Analyzing data nodes...";
        
        // Append grounding URLs if present
        if (mode === 'search' && groundingMetadata?.groundingChunks) {
          const urls = groundingMetadata.groundingChunks
            .filter((chunk: any) => chunk.web?.uri)
            .map((chunk: any) => chunk.web.uri);
          if (urls.length > 0) {
            text += "\n\nSources Analyzed:\n" + Array.from(new Set(urls)).map(u => `- ${u}`).join('\n');
          }
        }

        return { 
          text,
          followUpQuestions: parsed.followUpQuestions || [],
          suggestedRoute: parsed.suggestedRoute || null,
          isError: false 
        }; 
    } catch (e) {
        return { text: response.text, isError: false, followUpQuestions: [] };
    }
  } catch (error) {
    console.error("Lola Node Error:", error);
    return { text: "Node communication error. Verify API key logic.", isError: true, followUpQuestions: [] };
  }
};

/**
 * Visual Analysis Node - Gemini 3 Pro Vision
 */
export const analyzeLolaImage = async (imageB64: string, prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        { inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } },
        { text: `You are the ArtisanFlow Visual Analyst. Analyze this image in the context of artisanal manufacturing. Prompt: ${prompt}` }
      ]
    });
    return response.text;
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'imagen-3.0-generate-002',
      contents: { parts: [{ text: prompt }] },
      config: { 
        imageConfig: { 
          imageSize: config.size, 
          aspectRatio: config.aspectRatio as any 
        } 
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
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
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const cleanText = text.replace(/\*/g, '-').replace(/#/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/`/g, '').replace(/\n/g, '. ').trim();
    const ttsPayload = cleanText.length > 500 ? cleanText.substring(0, 497) + "..." : cleanText;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: ttsPayload }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
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