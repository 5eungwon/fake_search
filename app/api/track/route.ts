import { NextRequest, NextResponse } from 'next/server'
import { eventNames, sameOrigin, saveEvent, textValue } from '@/lib/experiment'
export const runtime = 'nodejs'
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    if (Number(request.headers.get('content-length')) > 4096) return NextResponse.json({ error: 'Request too large' }, { status: 413 })
    const body = await request.json()
    if (!body || !(eventNames as readonly string[]).includes(body.event)) return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
    await saveEvent({ event: body.event, source: textValue(body.source) || 'direct', campaign: textValue(body.campaign) || 'default', variant: textValue(body.variant) || 'default', placement: textValue(body.placement), timestamp: new Date().toISOString() })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Tracking unavailable' }, { status: 503 }) }
}
