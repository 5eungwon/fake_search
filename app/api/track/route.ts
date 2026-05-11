import { NextRequest, NextResponse } from 'next/server'

const counts = { visit: 0, email_submit: 0, coupon1: 0, coupon2: 0 }

export async function GET(request: NextRequest) {
  const event = request.nextUrl.searchParams.get('event') ?? 'unknown'
  const timestamp = new Date().toISOString()
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const ua = request.headers.get('user-agent') ?? ''

  const allowed = ['visit', 'coupon1', 'coupon2', 'email_submit']
  if (!allowed.includes(event)) {
    return NextResponse.json({ ok: false, error: 'invalid event' }, { status: 400 })
  }

  const email = request.nextUrl.searchParams.get('email') ?? null

  counts[event as keyof typeof counts]++

  console.log(
    JSON.stringify({
      type: 'FITVIEW_TRACK',
      event,
      timestamp,
      ip,
      ua: ua.slice(0, 120),
      ...(email ? { email } : {}),
    })
  )
  const who = email ?? ip
  console.log(
    `[FITVIEW 집계] 접속자수: ${counts.visit} | 이메일보낸수: ${counts.email_submit} | 쿠폰1누른수: ${counts.coupon1} | 쿠폰2누른수: ${counts.coupon2} | 발생: ${event} by ${who}`
  )

  return NextResponse.json({ ok: true, event, timestamp })
}
