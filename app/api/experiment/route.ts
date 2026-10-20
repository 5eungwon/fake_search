import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { readExperiment, type Application } from '@/lib/experiment'
import { paidIntent } from '@/lib/offer'
import { isCoreTarget, type SurveyResponse } from '@/lib/survey'
export const runtime = 'nodejs'
function authorized(request: Request) {
  const expected = process.env.PMF_ADMIN_TOKEN
  if (!expected) return false
  const actual = request.headers.get('authorization')?.replace(/^Bearer /, '') || ''
  const a = Buffer.from(actual), b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}
function csvCell(value: unknown) {
  let text = Array.isArray(value) ? value.join('; ') : String(value ?? '')
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}
function rate(numerator: number, denominator: number) {
  return denominator ? Math.round(numerator / denominator * 1000) / 10 : null
}
function funnel(surveys: SurveyResponse[], applications: Application[]) {
  const linked = new Set(applications.filter(a => a.priceIntent === paidIntent && a.priceConfirmed && a.surveyId).map(a => a.surveyId))
  const core = surveys.filter(isCoreTarget)
  const linkedSurveys = surveys.filter(s => linked.has(s.id)).length
  const coreApplications = core.filter(s => linked.has(s.id)).length
  return { surveyResponses: surveys.length, separateHouseOwners: surveys.filter(s => s.hasHouse).length, delayedManagement: surveys.filter(s => s.hasHouse && s.delayed).length, delayDurations: surveys.filter(s => s.hasHouse).reduce<Record<string, number>>((counts, s) => { const duration = s.delayDuration || '과거 설문(기간 미수집)'; counts[duration] = (counts[duration] || 0) + 1; return counts }, {}), coreTargets: core.length, linkedApplications: linkedSurveys, coreTargetApplications: coreApplications, overallApplicationRatePercent: rate(linkedSurveys, surveys.length), coreTargetApplicationRatePercent: rate(coreApplications, core.length) }
}
export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { events, applications, coupons, surveys } = await readExperiment()
    const headers = { 'Cache-Control': 'no-store' }
    const surveysById = new Map(surveys.map(s => [s.id, s]))
    if (request.nextUrl.searchParams.get('format') === 'csv') {
      const surveyKeys = ['hasHouse','managementMethods','managementOther','delayed','delayDuration','delayDurationOther','delayReason','delayOther'] as const
      let rows: string[]
      const isSurvey = request.nextUrl.searchParams.get('dataset') === 'surveys'
      if (isSurvey) {
        const keys = ['id','createdAt',...surveyKeys,'source','campaign','variant'] as const
        rows = [[...keys,'coreTarget','applicationCompleted'].join(','), ...surveys.map(s => [...keys.map(key => csvCell(s[key])), csvCell(isCoreTarget(s)), csvCell(applications.some(a => a.surveyId === s.id && a.priceConfirmed && a.priceIntent === paidIntent))].join(','))]
      } else {
        const keys = ['id','createdAt','surveyId','ownership','houseType','region','lastVisit','purpose','currentMethod','frequency','priceIntent','offeredPrice','billingUnit','offerVersion','priceConfirmed','contact','interviewConsent','source','campaign','variant'] as const
        rows = [[...keys,...surveyKeys,'couponCode','couponDiscount','couponIssuedAt','couponExpiresAt'].join(','), ...applications.map(a => {
          const coupon = coupons.find(c => c.applicationId === a.id), survey = a.surveyId ? surveysById.get(a.surveyId) : undefined
          return [...keys.map(key => csvCell(a[key])), ...surveyKeys.map(key => csvCell(survey?.[key])), ...[coupon?.code,coupon?.discount,coupon?.issuedAt,coupon?.expiresAt].map(csvCell)].join(',')
        })]
      }
      return new Response('\uFEFF' + rows.join('\r\n'), { headers: { ...headers, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="jibon-${isSurvey ? 'surveys' : 'applications'}.csv"` } })
    }
    const attributionKey = (item: { source: string; campaign: string; variant: string }) => JSON.stringify([item.source,item.campaign,item.variant])
    const sources = new Map<string, { source: string; campaign: string; variant: string }>()
    for (const item of [...events,...surveys,...applications]) sources.set(attributionKey(item), { source: item.source, campaign: item.campaign, variant: item.variant })
    const counts = (items: typeof events) => items.reduce<Record<string,number>>((result,e) => { result[e.event] = (result[e.event] || 0) + 1; return result }, {})
    return NextResponse.json({
      measuredAt: new Date().toISOString(),
      note: '설문 응답과 연결된 신청을 집계합니다. 동일 설문의 여러 신청은 전환 계산에서 1건입니다. 같은 사람이 새 설문을 제출하면 별도 응답입니다. 이벤트는 발생 횟수이며 신청·쿠폰은 실제 결제가 아닙니다.',
      coreTargetDefinition: '별도 주택 있음 + 실제 관리 지연 경험 + 가장 큰 이유가 시간 부족/이동 부담/번거로움/지인 부탁 부담',
      events: counts(events), applications: applications.length, paidReservations: applications.filter(a => a.priceIntent === paidIntent && a.priceConfirmed).length, couponsIssued: coupons.length,
      funnel: funnel(surveys, applications),
      sources: Array.from(sources.entries()).map(([key, source]) => {
        const apps = applications.filter(a => attributionKey(a) === key)
        return { ...source, events: counts(events.filter(e => attributionKey(e) === key)), applications: apps.length, owners: apps.filter(a => a.surveyId ? surveysById.get(a.surveyId)?.hasHouse : a.ownership !== '아직 관리 중인 주택은 없어요').length, willingToPay: apps.filter(a => a.priceIntent === paidIntent).length, paidReservations: apps.filter(a => a.priceIntent === paidIntent && a.priceConfirmed).length, couponsIssued: coupons.filter(c => apps.some(a => a.id === c.applicationId)).length, funnel: funnel(surveys.filter(s => attributionKey(s) === key), apps) }
      })
    }, { headers })
  } catch { return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 }) }
}
