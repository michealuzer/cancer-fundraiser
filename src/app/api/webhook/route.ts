// This file is intentionally unused — payment capture is handled
// via /api/capture (PayPal redirect flow) instead of a webhook.
export async function POST() {
  return new Response(null, { status: 404 });
}
