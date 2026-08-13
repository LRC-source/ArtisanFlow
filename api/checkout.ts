import { VercelRequest, VercelResponse } from '@vercel/node';
import { SquareClient, SquareEnvironment } from 'square';
import crypto from 'crypto';

// Initialize Square Client using environment secret
const squareClient = new SquareClient({
  environment: process.env.NODE_ENV === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
  token: process.env.SQUARE_ACCESS_TOKEN,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { sourceId, amount = 2900, currency = 'USD' } = req.body; // Default amount $29.00 subscription/access fee

    if (!sourceId) {
      return res.status(400).json({ success: false, error: 'Missing payment source token (nonce).' });
    }

    if (!process.env.SQUARE_ACCESS_TOKEN) {
      return res.status(500).json({ success: false, error: 'Server configuration error: Square token missing.' });
    }

    // Call official Square Payments API
    const response = await squareClient.payments.create({
      sourceId: sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(amount), // Amount in smallest currency unit (cents)
        currency: currency,
      },
    });

    const payment = response.payment || (response as any).result?.payment;

    return res.status(200).json({
      success: true,
      paymentId: payment?.id,
      status: payment?.status,
    });
  } catch (error: any) {
    console.error('Square Payment Processing Error:', error);
    return res.status(500).json({
      success: false,
      error: error.errors?.[0]?.detail || error.message || 'Payment processing failed.',
    });
  }
}
