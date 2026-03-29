// Unused — card payments are captured via /api/capture-card
export async function POST() {
  return new Response(null, { status: 404 });
}
