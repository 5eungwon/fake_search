import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const EVENTS = ['visit', 'coupon_click', 'coupon1', 'coupon2'] as const
type Event = (typeof EVENTS)[number]

const KEY: Record<Event, string> = {
  visit: 'fitview:visit',
  coupon_click: 'fitview:coupon_click',
  coupon1: 'fitview:coupon1',
  coupon2: 'fitview:coupon2',
}

function pct(n: number, d: number) {
  return d === 0 ? '—' : `${((n / d) * 100).toFixed(1)}%`
}

const redis = Redis.fromEnv()

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('event')
  const timestamp = new Date().toISOString()

  if (!raw || !(EVENTS as readonly string[]).includes(raw)) {
    return NextResponse.json({ ok: false, error: 'invalid event' }, { status: 400 })
  }

  const event = raw as Event

  await redis.incr(KEY[event])

  const [visit, coupon_click, coupon1, coupon2] = await Promise.all([
    redis.get<number>(KEY.visit),
    redis.get<number>(KEY.coupon_click),
    redis.get<number>(KEY.coupon1),
    redis.get<number>(KEY.coupon2),
  ])

  const c = {
    visit: visit ?? 0,
    coupon_click: coupon_click ?? 0,
    coupon1: coupon1 ?? 0,
    coupon2: coupon2 ?? 0,
  }

  console.log(
    JSON.stringify({
      type: 'FITVIEW_STATS',
      event,
      timestamp,
      cumulative: c,
      conversion: {
        'visit → coupon_click': pct(c.coupon_click, c.visit),
        'coupon_click → coupon1': pct(c.coupon1, c.coupon_click),
        'coupon_click → coupon2': pct(c.coupon2, c.coupon_click),
        'visit → coupon1': pct(c.coupon1, c.visit),
        'visit → coupon2': pct(c.coupon2, c.visit),
        'visit → 쿠폰 1개이상': pct(c.coupon1 + c.coupon2, c.visit),
      },
    })
  )

  return NextResponse.json({ ok: true, event, timestamp })
}
