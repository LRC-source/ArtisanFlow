

/**
 * Lola AI Architect - High Velocity & Deep Thinking Node (v1.4 - Server + Client Fallback)
 * Primary path: POST /api/gemini (Vercel serverless, uses GEMINI_API_KEY)
 * Fallback path: direct @google/genai SDK (uses VITE_GEMINI_API_KEY, runs in browser)
 */
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';


const enforceQuota = async (type: 'text' | 'image' | 'video'): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return false;
    
    const data = snap.data();
    const tier = data.tier || 'Free Trial';
    const isTrial = data.status === 'trialing';
    const effectiveTier = isTrial ? 'Free Trial' : tier;
    
    let limits = { text: 500, images: 50, videos: 0 };
    switch(effectiveTier) {
      case 'Free Trial': limits = { text: 500, images: 30, videos: 2 }; break;
      case 'Pro Artisan': limits = { text: 500, images: 100, videos: 10 }; break;
      case 'Master Artisan': limits = { text: 500, images: 300, videos: 30 }; break;
    }
    
    const currentDate = new Date().toISOString().slice(0, 10);
      const currentMonth = currentDate.slice(0, 7);
      const profile = data.profile || {};
      let usage = profile.aiUsage || {};
      
      if (usage.month !== currentMonth) {
        usage = { text: 0, textDate: currentDate, images: 0, videos: 0, month: currentMonth };
      } else if (usage.textDate !== currentDate) {
        usage.text = 0;
        usage.textDate = currentDate;
      }
      
    const typeKey = type === 'image' ? 'images' : type === 'video' ? 'videos' : 'text';
    if (usage[typeKey] >= limits[typeKey]) {
       toast.error(`AI ${type} quota exhausted for this billing cycle.`);
       return false;
    }
    return true;
  } catch(e) {
    console.error("Quota check failed", e);
    return true; // fail open if DB issue
  }
};

const recordUsage = async (type: 'text' | 'image' | 'video') => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;
    const data = snap.data();
    const currentDate = new Date().toISOString().slice(0, 10);
      const currentMonth = currentDate.slice(0, 7);
      const profile = data.profile || {};
      let usage = profile.aiUsage || {};
      
      if (usage.month !== currentMonth) {
        usage = { text: 0, textDate: currentDate, images: 0, videos: 0, month: currentMonth };
      } else if (usage.textDate !== currentDate) {
        usage.text = 0;
        usage.textDate = currentDate;
      }
      
    const typeKey = type === 'image' ? 'images' : type === 'video' ? 'videos' : 'text';
    usage[typeKey] = (usage[typeKey] || 0) + 1;
    await updateDoc(userRef, { 'profile.aiUsage': usage });
  } catch(e) {
    console.error("Failed to record usage", e);
  }
};

export const chatWithLola = async (message: string, context?: any, mode: 'fast' | 'deep' | 'search' = 'fast') => { 
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();
    if (!(await enforceQuota('text'))) throw new Error('Quota Exhausted');

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
    
                let data;
      const rawText = await response.text();
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        data = { error: `Server returned non-JSON response (Status: ${response.status}): ${rawText.substring(0, 100)}` };
      }

      if (response.ok && !data.error) {
        await recordUsage('text');
        return data;
      } else {
        return { text: data.error || data.text || "Server error", isError: true, followUpQuestions: [] };
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
    if (!(await enforceQuota('text'))) throw new Error('Quota Exhausted');
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const response = await fetch('/api/gemini', { signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action: 'analyzeLolaImage', payload: { imageB64, prompt } })
    });
    const data = await response.json();
    if (data.audio) await recordUsage('text');
    if (!data.error) await recordUsage('text');
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
    if (!(await enforceQuota('image'))) throw new Error('Quota Exhausted');
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const response = await fetch('/api/gemini', { signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action: 'generateLolaImage', payload: { prompt, config } })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!data.image) throw new Error('No image returned');
    await recordUsage('image');
    return data.image;
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
    if (!(await enforceQuota('text'))) throw new Error('Quota Exhausted');
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const response = await fetch('/api/gemini', { signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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



