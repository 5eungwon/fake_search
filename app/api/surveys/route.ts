import { NextRequest, NextResponse } from 'next/server'
import { sameOrigin, saveSurvey, textValue } from '@/lib/experiment'
import { managementOptions, delayReasons, delayDurations, delayedFromDuration, type SurveyResponse } from '@/lib/survey'
export const runtime = 'nodejs'
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 })
  try {
    if (Number(request.headers.get('content-length')) > 8192) return NextResponse.json({ error: '입력 내용이 너무 깁니다.' }, { status: 413 })
    const body = await request.json()
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!body || body.website || !uuid.test(body.requestId || '') || typeof body.hasHouse !== 'boolean') return NextResponse.json({ error: '주택 보유 여부를 선택해주세요.' }, { status: 400 })
    let methods: string[] = [], delayed: boolean | null = null, reason: string | null = null, managementOther = '', delayOther = '', delayDuration: string | null = null, delayDurationOther = ''
    if (body.hasHouse) {
      if (!Array.isArray(body.managementMethods) || !body.managementMethods.length || body.managementMethods.some((m: unknown) => !(managementOptions as readonly unknown[]).includes(m))) return NextResponse.json({ error: '현재 관리 방법을 한 가지 이상 선택해주세요.' }, { status: 400 })
      methods = [...new Set<string>(body.managementMethods)]
      if (methods.includes('거의 관리하지 않음') && methods.length !== 1) return NextResponse.json({ error: '거의 관리하지 않음은 다른 관리 방법과 함께 선택할 수 없습니다.' }, { status: 400 })
      managementOther = methods.includes('기타') ? textValue(body.managementOther, 300) : ''
      if (methods.includes('기타') && !managementOther) return NextResponse.json({ error: '기타 관리 방법을 적어주세요.' }, { status: 400 })
      if (!(delayDurations as readonly unknown[]).includes(body.delayDuration)) return NextResponse.json({ error: '실제로 미룬 기간을 선택해주세요.' }, { status: 400 })
      delayDuration = body.delayDuration
      delayed = delayedFromDuration(body.delayDuration)
      delayDurationOther = delayDuration === '직접 입력' ? textValue(body.delayDurationOther, 100) : ''
      if (delayDuration === '직접 입력' && !delayDurationOther) return NextResponse.json({ error: '실제로 미룬 기간을 적어주세요.' }, { status: 400 })
      if (delayed) {
        if (!(delayReasons as readonly unknown[]).includes(body.delayReason)) return NextResponse.json({ error: '관리를 미룬 가장 큰 이유를 선택해주세요.' }, { status: 400 })
        reason = body.delayReason
        delayOther = reason === '기타' ? textValue(body.delayOther, 300) : ''
        if (reason === '기타' && !delayOther) return NextResponse.json({ error: '기타 이유를 적어주세요.' }, { status: 400 })
      }
    }
    const survey: SurveyResponse = { id: crypto.randomUUID(), requestId: body.requestId, createdAt: new Date().toISOString(), hasHouse: body.hasHouse, managementMethods: methods, managementOther, delayed, delayDuration, delayDurationOther, delayReason: reason, delayOther, source: textValue(body.source) || 'direct', campaign: textValue(body.campaign) || 'default', variant: textValue(body.variant) || 'default' }
    const saved = await saveSurvey(survey)
    return NextResponse.json({ ok: true, id: saved.id, hasHouse: saved.hasHouse }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch { return NextResponse.json({ error: '응답을 저장하지 못했습니다. 잠시 후 다시 제출해주세요.' }, { status: 503 }) }
}
