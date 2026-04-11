export async function GET() {
  await fetch(`${process.env.API_URL}/finish`)
  return Response.json({ ok: true })
}