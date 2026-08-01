import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Square Webhooks must be POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!signatureKey) {
    console.error("Missing SQUARE_WEBHOOK_SIGNATURE_KEY in environment");
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Extract the Square signature from headers
  const squareSignature = req.headers['x-square-hmacsha256-signature'] as string;
  
  if (!squareSignature) {
    return res.status(401).json({ error: 'Missing Square signature' });
  }

  try {
    // 1. Get the notification URL (must exactly match what is in Square Developer Dashboard)
    // For Vercel, we can construct it from the host header, or assume the fixed URL
    const host = req.headers.host || 'artisanflow.lrcholisticmarketing.online';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const notificationUrl = `${protocol}://${host}/api/webhooks/square`;

    // 2. Stringify the raw body exactly as received
    // Note: Vercel automatically parses JSON bodies, so we stringify it back.
    // For perfect signature matching, raw body is preferred, but stringifying the parsed body usually works for Square if no whitespace is altered.
    const bodyString = JSON.stringify(req.body);

    // 3. Combine notification URL and body string
    const stringToSign = notificationUrl + bodyString;

    // 4. Generate HMAC-SHA256 signature
    const hmac = crypto.createHmac('sha256', signatureKey);
    hmac.update(stringToSign);
    const hash = hmac.digest('base64');

    // 5. Compare the signatures
    if (hash !== squareSignature) {
      console.warn("Webhook signature verification failed.");
      console.warn("Expected:", hash, "Received:", squareSignature);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log("✅ Square Webhook Verified Authenticity!");
    
    // Parse the event type
    const event = req.body;
    console.log(`Received Event: ${event.type}`);

    // TODO: Route specific events (like 'order.created' or 'payment.updated') to Firestore
    
    // Always return 200 OK to Square so they know we received it
    return res.status(200).json({ success: true, message: "Webhook received and verified." });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
