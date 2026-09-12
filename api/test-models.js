export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const fetchRes = await fetch(https://generativelanguage.googleapis.com/v1beta/models?key=+apiKey);
    const data = await fetchRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
