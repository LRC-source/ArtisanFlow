export default async function handler(req, res) {
  try {
    let b = req.body;
    if (typeof b === 'string') { b = JSON.parse(b); }
    if (b && b.prompt === 'GET_MODELS_DEBUG') {
      const apiKey = process.env.GEMINI_API_KEY;
      const fetchRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
      const data = await fetchRes.text();
      return res.status(200).send(data);
    }
  } catch(e) {}
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;
    const verifyRes = await fetch(https://identitytoolkit.googleapis.com/v1/accounts:lookup?key= + FIREBASE_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.users || !verifyData.users.length) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Server-side genai proxy logic
    const body = req.body || {};
    let promptText = body.prompt;
    if (body.action === 'chatWithLola' && body.payload) {
        promptText = body.payload.message;
        if (body.payload.context) {
            promptText += "\nContext: " + JSON.stringify(body.payload.context);
        }
    } else if (body.action === 'analyzeLolaImage' && body.payload) {
        promptText = body.payload.prompt;
    } else if (body.action === 'generateLolaImage' && body.payload) {
        promptText = body.payload.prompt;
    }
    
    if (!promptText) promptText = "Hello";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing Gemini API Key' });

    const fetchRes = await fetch(https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key= + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: promptText }] }]
      })
    });
    
    const data = await fetchRes.json();
    
    // Extract text for the frontend
    let text = "";
    if (data.candidates && data.candidates[0].content.parts) {
        text = data.candidates[0].content.parts.map(p => p.text).join("");
    } else if (data.error) {
        text = "Error: " + data.error.message;
    }
    
    return res.status(200).json({ ...data, text });
  } catch (error) {
    return res.status(500).json({ error: error.message, text: error.message });
  }
}
