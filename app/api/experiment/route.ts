import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { readExperiment } from '@/lib/experiment'
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
    const { events, applications } = await readExperiment()
    const headers = { 'Cache-Control': 'no-store' }
    if (request.nextUrl.searchParams.get('format') === 'csv') {
      const keys = ['id','createdAt','ownership','houseType','region','lastVisit','purpose','currentMethod','frequency','priceIntent','contact','interviewConsent','source','campaign','variant'] as const
      const csv = '\uFEFF' + [keys.join(','), ...applications.map(a => keys.map(key => csvCell(a[key])).join(','))].join('\r\n')
      return new Response(csv, { headers: { ...headers, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="jibon-applications.csv"' } })
    }
    const groups = new Map<string, { source: string; campaign: string; variant: string; events: Record<string, number>; applications: number; owners: number; willingToPay: number }>()
    function group(item: { source: string; campaign: string; variant: string }) {
      const key = JSON.stringify([item.source, item.campaign, item.variant])
      if (!groups.has(key)) groups.set(key, { source: item.source, campaign: item.campaign, variant: item.variant, events: {}, applications: 0, owners: 0, willingToPay: 0 })
      return groups.get(key)!
    }
    for (const event of events) { const g = group(event); g.events[event.event] = (g.events[event.event] || 0) + 1 }
    for (const app of applications) { const g = group(app); g.applications++; if (app.ownership !== '아직 관리 중인 주택은 없어요') g.owners++; if (app.priceIntent === '조건이 맞으면 유료로 이용하고 싶어요') g.willingToPay++ }
    return NextResponse.json({ measuredAt: new Date().toISOString(), note: '이벤트는 발생 횟수이며 고유 방문자 수가 아닙니다. 신청은 참여 의향이며 결제 증거가 아닙니다.', events: events.reduce<Record<string, number>>((counts, e) => { counts[e.event] = (counts[e.event] || 0) + 1; return counts }, {}), applications: applications.length, sources: Array.from(groups.values()) }, { headers })
  } catch { return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 }) }
}
