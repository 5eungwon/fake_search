import { NextRequest, NextResponse } from 'next/server'

const EVENTS = ['visit', 'coupon_click', 'coupon1', 'coupon2'] as const
type Event = (typeof EVENTS)[number]

const counts: Record<Event, number> = { visit: 0, coupon_click: 0, coupon1: 0, coupon2: 0 }

function pct(n: number, d: number) {
  return d === 0 ? '—' : `${((n / d) * 100).toFixed(1)}%`
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('event')
  if (!raw || !(EVENTS as readonly string[]).includes(raw)) {
    return NextResponse.json({ ok: false, error: 'invalid event' }, { status: 400 })
  }

  const event = raw as Event
  counts[event]++

  const { visit, coupon_click, coupon1, coupon2 } = counts
  console.log(
    JSON.stringify({
      type: 'FITVIEW_STATS',
      event,
      timestamp: new Date().toISOString(),
      cumulative: { visit, coupon_click, coupon1, coupon2 },
      conversion: {
        'visit → coupon_click': pct(coupon_click, visit),
        'coupon_click → coupon1': pct(coupon1, coupon_click),
        'coupon_click → coupon2': pct(coupon2, coupon_click),
        'visit → coupon1': pct(coupon1, visit),
        'visit → coupon2': pct(coupon2, visit),
        'visit → 쿠폰 1개이상': pct(coupon1 + coupon2, visit),
      },
    })
  )

  return NextResponse.json({ ok: true, event })
}
