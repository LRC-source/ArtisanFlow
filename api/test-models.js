export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(200).send("No GEMINI_API_KEY found");
    }
    const fetchRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
    const data = await fetchRes.text();
    return res.status(200).send(data);
  } catch (error) {
    return res.status(200).send("Error: " + error.message);
  }
}
