// Card payments are now handled by PayPal Smart Buttons via /api/create-order and /api/capture-card
export async function POST() {
  return new Response(null, { status: 404 });
}
