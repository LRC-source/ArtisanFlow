export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const fetchRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
    const data = await fetchRes.text();
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
