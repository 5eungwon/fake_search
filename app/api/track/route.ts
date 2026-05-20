import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const EVENTS = ['visit', 'coupon_click', 'coupon1', 'coupon2'] as const
type Event = (typeof EVENTS)[number]

const KEY: Record<Event, string> = {
  visit: 'fitview:visit',
  coupon_click: 'fitview:coupon_click',
  coupon1: 'fitview:coupon1',
  coupon2: 'fitview:coupon2',
}

function pct(numerator: number, denominator: number): string {
  if (denominator === 0) return '—'
  return `${((numerator / denominator) * 100).toFixed(1)}%`
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('event')
  const timestamp = new Date().toISOString()

  if (!raw || !(EVENTS as readonly string[]).includes(raw)) {
    return NextResponse.json({ ok: false, error: 'invalid event' }, { status: 400 })
  }

  const event = raw as Event
  let counts = { visit: 0, coupon_click: 0, coupon1: 0, coupon2: 0 }
  let kvOk = false

  try {
    // 원자적 카운터 증가
    await kv.incr(KEY[event])

    // 전체 카운터 일괄 조회
    const [v, cc, c1, c2] = await Promise.all([
      kv.get<number>(KEY.visit),
      kv.get<number>(KEY.coupon_click),
      kv.get<number>(KEY.coupon1),
      kv.get<number>(KEY.coupon2),
    ])

    counts = {
      visit: v ?? 0,
      coupon_click: cc ?? 0,
      coupon1: c1 ?? 0,
      coupon2: c2 ?? 0,
    }
    kvOk = true
  } catch {
    // KV 미연결 시 이벤트 자체만 기록
    console.log(
      JSON.stringify({
        type: 'FITVIEW_EVENT',
        event,
        timestamp,
        note: 'KV not connected — cumulative unavailable',
      })
    )
    return NextResponse.json({ ok: true, event, timestamp, kv: false })
  }

  const { visit, coupon_click, coupon1, coupon2 } = counts

  console.log(
    JSON.stringify({
      type: 'FITVIEW_STATS',
      event,
      timestamp,
      kv: kvOk,
      // ── 누적 집계 ──────────────────────────
      cumulative: {
        visit,
        coupon_click,
        coupon1,
        coupon2,
      },
      // ── 전환율 ────────────────────────────
      conversion: {
        'visit → coupon_click': pct(coupon_click, visit),
        'coupon_click → coupon1': pct(coupon1, coupon_click),
        'coupon_click → coupon2': pct(coupon2, coupon_click),
        'visit → coupon1 (전체)': pct(coupon1, visit),
        'visit → coupon2 (전체)': pct(coupon2, visit),
        'visit → 쿠폰 중 1개이상': pct(coupon1 + coupon2, visit),
      },
    })
  )

  return NextResponse.json({ ok: true, event, timestamp, kv: kvOk })
}
