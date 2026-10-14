import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { readExperiment } from '@/lib/experiment'
import { paidIntent } from '@/lib/offer'
export const runtime = 'nodejs'
function authorized(request: Request) {
  const expected = process.env.PMF_ADMIN_TOKEN
  if (!expected) return false
  const actual = request.headers.get('authorization')?.replace(/^Bearer /, '') || ''
  const a = Buffer.from(actual), b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}
function csvCell(value: unknown) {
  let text = String(value ?? '')
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}
export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { events, applications, coupons } = await readExperiment()
    const headers = { 'Cache-Control': 'no-store' }
    if (request.nextUrl.searchParams.get('format') === 'csv') {
      const keys = ['id','createdAt','ownership','houseType','region','lastVisit','purpose','currentMethod','frequency','priceIntent','offeredPrice','offerVersion','priceConfirmed','contact','interviewConsent','source','campaign','variant'] as const
      const csv = '\uFEFF' + [[...keys, 'couponCode', 'couponDiscount', 'couponIssuedAt', 'couponExpiresAt'].join(','), ...applications.map(a => { const coupon = coupons.find(c => c.applicationId === a.id); return [...keys.map(key => csvCell(a[key])), ...[coupon?.code, coupon?.discount, coupon?.issuedAt, coupon?.expiresAt].map(csvCell)].join(',') })].join('\r\n')
      return new Response(csv, { headers: { ...headers, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="jibon-applications.csv"' } })
    }
    const groups = new Map<string, { source: string; campaign: string; variant: string; events: Record<string, number>; applications: number; owners: number; willingToPay: number; paidReservations: number; couponsIssued: number }>()
    function group(item: { source: string; campaign: string; variant: string }) {
      const key = JSON.stringify([item.source, item.campaign, item.variant])
      if (!groups.has(key)) groups.set(key, { source: item.source, campaign: item.campaign, variant: item.variant, events: {}, applications: 0, owners: 0, willingToPay: 0, paidReservations: 0, couponsIssued: 0 })
      return groups.get(key)!
    }
    for (const event of events) { const g = group(event); g.events[event.event] = (g.events[event.event] || 0) + 1 }
    for (const app of applications) { const g = group(app); g.applications++; if (app.ownership !== '아직 관리 중인 주택은 없어요') g.owners++; if (app.priceIntent === paidIntent) g.willingToPay++; if (app.priceIntent === paidIntent && app.priceConfirmed) g.paidReservations++; if (coupons.some(c => c.applicationId === app.id)) g.couponsIssued++ }
    return NextResponse.json({ measuredAt: new Date().toISOString(), note: '이벤트는 발생 횟수이며 고유 방문자 수가 아닙니다. 유료 예약과 쿠폰 발급은 이용 의향이며 결제 증거가 아닙니다.', events: events.reduce<Record<string, number>>((counts, e) => { counts[e.event] = (counts[e.event] || 0) + 1; return counts }, {}), applications: applications.length, paidReservations: applications.filter(a => a.priceIntent === paidIntent && a.priceConfirmed).length, couponsIssued: coupons.length, sources: Array.from(groups.values()) }, { headers })
  } catch { return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 }) }
}
