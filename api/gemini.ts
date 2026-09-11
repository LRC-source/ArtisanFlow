import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import * as admin from 'firebase-admin';
const adminAny = admin as any;

// Initialize Firebase Admin if not already initialized
if (!adminAny.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      adminAny.initializeApp({
        credential: adminAny.credential.cert(JSON.parse(serviceAccountKey))
      });
    } else {
      // Fallback for Vercel/GCP environment default credentials
      adminAny.initializeApp();
    }
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

// Fixed Tier Caps Configuration (Must match TIER_CONFIGS on frontend)
const TIER_CAPS: Record<string, any> = {
  'Free Trial': { images: 50, videos: 2, articles: 15, posts: 50, lola: 25 },
  'Basic Artisan': { images: 50, videos: 2, articles: 10, posts: 30, lola: 15 },
  'Pro Artisan': { images: 100, videos: 5, articles: 30, posts: 100, lola: 50 },
  'Master Artisan': { images: 200, videos: 10, articles: 60, posts: 200, lola: 150 },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth Verification
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split('Bearer ')[1];
  let decodedToken;
  try {
    decodedToken = await adminAny.auth().verifyIdToken(token);
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
  const uid = decodedToken.uid;

  const { action, payload } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing GEMINI_API_KEY' });
  }

  // Determine usage type based on action
  let usageType = '';
  if (action === 'chatWithLola') usageType = 'lola';
  else if (action === 'generateLolaImage') usageType = 'images';
  else if (action === 'generateLolaVideo') usageType = 'videos';
  // If articles/posts are added, map them here.

  // Gating & Usage Tracking
  const db = adminAny.firestore();
  
  if (usageType) {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    try {
      const userDocRef = db.collection('users').doc(uid);
      
      const allowed = await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(userDocRef);
        if (!doc.exists) return false;
        
        const data = doc.data()!;
        const tier = data.tier || 'Free Trial';
        const caps = TIER_CAPS[tier] || TIER_CAPS['Free Trial'];
        
        const usageRef = data.usage || {};
        const monthUsage = usageRef[currentMonth] || { images: 0, videos: 0, articles: 0, posts: 0, lola: 0 };
        
        const currentCount = monthUsage[usageType] || 0;
        const cap = caps[usageType];
        
        if (currentCount >= cap && data.role !== 'admin') {
          return false; // Cap reached
        }
        
        // Increment
        monthUsage[usageType] = currentCount + 1;
        usageRef[currentMonth] = monthUsage;
        
        transaction.update(userDocRef, { usage: usageRef });
        return true;
      });

      if (!allowed) {
        return res.status(403).json({ 
          error: `Monthly cap reached for ${usageType}. Please upgrade your tier.`, 
          isError: true, 
          followUpQuestions: [] 
        });
      }
    } catch (error) {
      console.error('Transaction error:', error);
      return res.status(500).json({ error: 'Failed to verify usage caps' });
    }
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    switch (action) {
      case 'chatWithLola': {
        const { message, context, mode = 'fast' } = payload;
        
        let model = 'gemini-2.5-flash';
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
          model = 'gemini-2.5-pro';
          config.thinkingConfig = { thinkingBudget: 32768 };
        } else if (mode === 'search') {
          model = 'gemini-2.5-flash';
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
          model: 'gemini-2.5-pro',
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

      case 'generateLolaVideo': {
        // Cash-Flow Safety: Check Global Kill-Switch
        const configDoc = await db.collection('config').doc('global').get();
        const isVideoEnabled = configDoc.exists ? configDoc.data()?.videoGenerationEnabled : false;
        
        if (!isVideoEnabled) {
          // If disabled, we refund the usage we just incremented
          if (uid) {
             await db.runTransaction(async (t) => {
                 const doc = await t.get(db.collection('users').doc(uid));
                 if (doc.exists) {
                    const data = doc.data()!;
                    const usageRef = data.usage || {};
                    const currentMonth = new Date().toISOString().slice(0, 7);
                    if (usageRef[currentMonth] && usageRef[currentMonth]['videos'] > 0) {
                        usageRef[currentMonth]['videos'] -= 1;
                        t.update(db.collection('users').doc(uid), { usage: usageRef });
                    }
                 }
             });
          }
          return res.status(403).json({ error: "Video generation is currently disabled globally.", isError: true });
        }

        const { prompt } = payload;
        
        // This is a placeholder since google-genai SDK doesn't natively support Veo via generateContent yet,
        // but we simulate the API call or prepare for it. 
        // For now, return a placeholder response so the frontend receives it.
        return res.status(200).json({ videoUrl: "https://storage.googleapis.com/artisanflow/placeholder_video.mp4" });
      }

      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error', isError: true, followUpQuestions: [] });
  }
}
