export async function GET() {
  await fetch(`${process.env.API_URL}/enter`)
  return Response.json({ ok: true })
}