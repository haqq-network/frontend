// A faulty API route to test Sentry's error monitoring
export async function GET() {
  // throw new Error('Sentry Example API Route Error');
  return Response.json({ data: null });
}
