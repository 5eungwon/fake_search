export async function GET() {
  await fetch(`${process.env.API_URL}/push`)
  return Response.json({ ok: true })
}