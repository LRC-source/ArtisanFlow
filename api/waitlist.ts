import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    
    // We forward the request to the LRC Master Operations Webhook
    // This is the script URL for the LRC Main Site database (where the waitlist script was deployed)
    const googleAppScriptUrl = 'https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec';

    const payload = {
      action: 'artisan_flow_lead',
      name: data.fullName,
      email: data.email,
      businessType: data.businessType
    };

    const response = await fetch(googleAppScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    return res.status(200).json({ success: true, result });
  } catch (error: any) {
    console.error('Waitlist Webhook Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
