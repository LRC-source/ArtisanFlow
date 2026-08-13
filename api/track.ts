export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    // Validate payload
    if (!payload.event || !payload.funnel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a production environment, you would forward this payload to a service like PostHog, Mixpanel, or BigQuery.
    // Example:
    // await fetch('https://app.posthog.com/capture/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     api_key: process.env.POSTHOG_API_KEY,
    //     event: payload.event,
    //     properties: {
    //       distinct_id: req.headers['x-forwarded-for'] || 'anonymous',
    //       $current_url: payload.path,
    //       funnel_type: payload.funnel,
    //       ...payload.metadata
    //     },
    //     timestamp: payload.timestamp
    //   })
    // });

    // For now, we safely log it so the serverless logs contain the metrics
    console.log('[FUNNEL_METRICS_TRACK]', JSON.stringify(payload));

    return res.status(200).json({ success: true, message: 'Event tracked successfully' });
  } catch (error) {
    console.error('Failed to track metric', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
