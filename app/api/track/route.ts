import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const event = request.nextUrl.searchParams.get('event') ?? 'unknown'
  const timestamp = new Date().toISOString()
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const ua = request.headers.get('user-agent') ?? ''

  const allowed = ['visit', 'coupon1', 'coupon2']
  if (!allowed.includes(event)) {
    return NextResponse.json({ ok: false, error: 'invalid event' }, { status: 400 })
  }

  console.log(
    JSON.stringify({
      type: 'FITVIEW_TRACK',
      event,
      timestamp,
      ip,
      ua: ua.slice(0, 120),
    })
  )

  return NextResponse.json({ ok: true, event, timestamp })
}
