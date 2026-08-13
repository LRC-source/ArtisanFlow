import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, Modality } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing GEMINI_API_KEY' });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    switch (action) {
      case 'chatWithLola': {
        const { message, context, mode = 'fast' } = payload;
        
        let model = 'gemini-2.5-flash-lite-latest';
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

        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const parsed = JSON.parse(response.text || "{}");
        let text = parsed.text || "Analyzing data nodes...";
        
        if (mode === 'search' && groundingMetadata?.groundingChunks) {
          const urls = groundingMetadata.groundingChunks
            .filter((chunk: any) => chunk.web?.uri)
            .map((chunk: any) => chunk.web.uri);
          if (urls.length > 0) {
            text += "\n\nSources Analyzed:\n" + Array.from(new Set(urls)).map(u => `- ${u}`).join('\n');
          }
        }

        return res.status(200).json({ 
          text,
          followUpQuestions: parsed.followUpQuestions || [],
          suggestedRoute: parsed.suggestedRoute || null,
          isError: false 
        });
      }
      
      case 'analyzeLolaImage': {
        const { imageB64, prompt } = payload;
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: [
            { inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } },
            { text: `You are the ArtisanFlow Visual Analyst. Analyze this image in the context of artisanal manufacturing. Prompt: ${prompt}` }
          ]
        });
        return res.status(200).json({ text: response.text });
      }

      case 'generateLolaImage': {
        const { prompt, config } = payload;
        const response = await ai.models.generateContent({
          model: 'imagen-3.0-generate-002',
          contents: { parts: [{ text: prompt }] },
          config: { 
            imageConfig: { 
              imageSize: config.size, 
              aspectRatio: config.aspectRatio 
            } 
          }
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              return res.status(200).json({ image: `data:image/png;base64,${part.inlineData.data}` });
            }
          }
        }
        return res.status(200).json({ image: null });
      }

      case 'generateLolaSpeech': {
        const { text } = payload;
        if (!text) return res.status(200).json({ audio: null });
        
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
        
        return res.status(200).json({ audio: response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data });
      }

      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error', isError: true, followUpQuestions: [] });
  }
}
