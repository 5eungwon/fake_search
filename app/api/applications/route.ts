import { NextRequest, NextResponse } from 'next/server'
import { choices, sameOrigin, saveApplication, issueCoupon, getSurvey, textValue, type Application } from '@/lib/experiment'
import { PILOT_OFFER, paidIntent } from '@/lib/offer'
export const runtime = 'nodejs'
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 })
  try {
    if (Number(request.headers.get('content-length')) > 8192) return NextResponse.json({ error: '입력 내용이 너무 깁니다.' }, { status: 413 })
    const body = await request.json()
    if (!body || typeof body !== 'object' || body.website) return NextResponse.json({ error: '신청 내용을 확인해주세요.' }, { status: 400 })
    if (!(choices.priceIntent as readonly unknown[]).includes(body.priceIntent)) return NextResponse.json({ error: '이용 의향을 확인해주세요.' }, { status: 400 })
    const survey = await getSurvey(textValue(body.surveyRequestId))
    if (!survey || survey.id !== body.surveyId || !survey.hasHouse) return NextResponse.json({ error: '별도 관리 주택에 대한 설문을 먼저 제출해주세요.' }, { status: 400 })
    if (body.offerVersion !== PILOT_OFFER.version) return NextResponse.json({ error: '요금 안내가 변경되었습니다. 새로고침 후 다시 예약해주세요.' }, { status: 409 })
    if (body.priceIntent === paidIntent && body.priceConfirmed !== true) return NextResponse.json({ error: '월 9,900원 유료 이용 의향 확인에 동의해주세요.' }, { status: 400 })
    const region = textValue(body.region, 60), contact = textValue(body.contact)
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
    const phone = /^(?:\+82|0)[\d\s()-]{8,18}$/.test(contact) && contact.replace(/\D/g, '').length >= 9
    if (region.length < 2 || body.consent !== true || (!email && !phone) || !/^[0-9a-f-]{36}$/i.test(body.requestId || '')) return NextResponse.json({ error: '지역, 유효한 연락처와 필수 동의를 확인해주세요.' }, { status: 400 })
    const application: Application = { id: crypto.randomUUID(), requestId: body.requestId, createdAt: new Date().toISOString(), region, contact, consent: true, interviewConsent: body.interviewConsent === true, surveyId: survey.id, ownership: '별도 관리 주택 있음(설문 응답)', currentMethod: survey.managementMethods.join('; '), frequency: '월 1회', priceIntent: body.priceIntent, offeredPrice: PILOT_OFFER.monthlyPrice, offerVersion: PILOT_OFFER.version, priceConfirmed: body.priceIntent === paidIntent && body.priceConfirmed === true, source: survey.source, campaign: survey.campaign, variant: survey.variant }
    const saved = await saveApplication(application)
    if (saved.priceIntent === paidIntent && saved.priceConfirmed) {
      try {
        const coupon = await issueCoupon(saved.requestId, saved.id)
        return NextResponse.json({ ok: true, id: saved.id, coupon: { code: coupon.code, expiresAt: coupon.expiresAt, discount: coupon.discount, offeredPrice: coupon.offeredPrice } }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
      } catch {
        // The application is already durable; let the user retry only coupon issuance.
        return NextResponse.json({ ok: true, id: saved.id, couponPending: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
      }
    }
    return NextResponse.json({ ok: true, id: saved.id }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const missing = error instanceof Error && error.message === 'STORAGE_NOT_CONFIGURED'
    return NextResponse.json({ error: missing ? '신청 접수를 준비 중입니다. 저장소 연결 후 다시 안내드릴게요.' : '신청을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.' }, { status: 503 })
  }
}
