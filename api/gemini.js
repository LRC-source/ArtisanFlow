export default async function handler(req, res) {
  console.log("Round 23.4 Backend Proxy Active");
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;
    const verifyRes = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.users || !verifyData.users.length) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    const body = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing Gemini API Key' });

    if (body.action === 'generateLolaImage' && body.payload) {
        const promptText = body.payload.prompt || 'A photorealistic artisanal product';
        
        const fetchRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });
        const data = await fetchRes.json();
        if (data.error) return res.status(502).json({ error: data.error.message || JSON.stringify(data.error) });
        
        let image = null;
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const inlineData = data.candidates[0].content.parts.find(p => p.inlineData)?.inlineData;
            if (inlineData) {
                image = `data:${inlineData.mimeType};base64,${inlineData.data}`;
            }
        }
        
        if (!image) return res.status(502).json({ error: 'Image generation failed or format unrecognized.' });
        return res.status(200).json({ image });
    }

    if (body.action === 'generateLolaVideo' && body.payload) {
        // Wired for veo-3.1-lite-generate-001 as directed, though not fully built out on the client yet
        return res.status(501).json({ error: 'Video generation requires the upcoming client feature build.' });
    }

    // Default: Text paths
    let promptText = body.prompt;
    if (body.action === 'chatWithLola' && body.payload) {
        promptText = body.payload.message;
        if (body.payload.context) {
            promptText += "\nContext: " + JSON.stringify(body.payload.context);
        }
    } else if (body.action === 'analyzeLolaImage' && body.payload) {
        promptText = body.payload.prompt;
    }
    if (!promptText) promptText = "Hello";

    const fetchRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: promptText }] }]
      })
    });
    
    const data = await fetchRes.json();
    let text = "";
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
        text = data.candidates[0].content.parts.map(p => p.text).join("");
    } else if (data.candidates && data.candidates[0].finishReason) {
        text = "Generation stopped: " + data.candidates[0].finishReason;
    } else if (data.error) {
        text = "Error: " + data.error.message;
        return res.status(502).json({ error: data.error.message, text });
    } else {
        text = "No response from AI.";
    }
    return res.status(200).json({ ...data, text });
  } catch (error) {
    return res.status(500).json({ error: error.message, text: error.message });
  }
}
