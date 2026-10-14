import { NextRequest, NextResponse } from 'next/server'
import { issueCoupon, sameOrigin } from '@/lib/experiment'
export const runtime = 'nodejs'
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 })
  try {
    const body = await request.json()
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!body || !uuid.test(body.requestId || '') || !uuid.test(body.applicationId || '')) return NextResponse.json({ error: '예약 정보를 확인해주세요.' }, { status: 400 })
    const coupon = await issueCoupon(body.requestId, body.applicationId)
    return NextResponse.json({ ok: true, coupon: { code: coupon.code, expiresAt: coupon.expiresAt, discount: coupon.discount, offeredPrice: coupon.offeredPrice } }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const reason = error instanceof Error ? error.message : ''
    if (reason === 'RESERVATION_NOT_FOUND') return NextResponse.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 })
    if (reason === 'NOT_A_PAID_RESERVATION') return NextResponse.json({ error: '유료 이용 의향을 확인한 예약에만 쿠폰을 발급합니다.' }, { status: 403 })
    if (reason === 'COUPON_EXPIRED') return NextResponse.json({ error: '쿠폰 발급 기간이 지났습니다.' }, { status: 410 })
    return NextResponse.json({ error: '쿠폰을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.' }, { status: 503 })
  }
}
