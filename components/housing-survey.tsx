'use client'
import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle, House, Ticket } from 'lucide-react'
import { managementOptions, delayReasons, delayDurations, delayedFromDuration } from '@/lib/survey'
import { priceLabel, discountLabel } from '@/lib/offer'
import SurveyReportPreview from '@/components/survey-report-preview'

type SurveyLink = { id: string; requestId: string }
export default function HousingSurvey({ onApply }: { onApply: (survey: SurveyLink) => void }) {
  const [hasHouse, setHasHouse] = useState<boolean | null>(null)
  const [methods, setMethods] = useState<string[]>([])
  const [managementOther, setManagementOther] = useState('')
  const [delayDuration, setDelayDuration] = useState('')
  const [delayDurationOther, setDelayDurationOther] = useState('')
  const delayed = delayedFromDuration(delayDuration)
  const [reason, setReason] = useState('')
  const [delayOther, setDelayOther] = useState('')
  const [requestId, setRequestId] = useState('')
  const [saved, setSaved] = useState<SurveyLink | null>(null)
  const [savedHasHouse, setSavedHasHouse] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [started, setStarted] = useState(false)
  function start() {
    if (started) return
    setStarted(true)
    const params = new URLSearchParams(window.location.search)
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'survey_start', source: params.get('utm_source') || 'direct', campaign: params.get('utm_campaign') || 'default', variant: params.get('utm_content') || 'default' }) }).catch(() => {})
  }
  function toggleMethod(method: string) {
    setMethods(current => {
      if (current.includes(method)) return current.filter(m => m !== method)
      if (method === '거의 관리하지 않음') return [method]
      return [...current.filter(m => m !== '거의 관리하지 않음'), method]
    })
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (hasHouse === null) { setError('주택 보유 여부를 선택해주세요.'); return }
    if (hasHouse && (!methods.length || !delayDuration || (delayed && !reason))) { setError('표시된 질문에 모두 응답해주세요.'); return }
    setSending(true); setError('')
    const id = requestId || crypto.randomUUID(); setRequestId(id)
    const params = new URLSearchParams(window.location.search)
    try {
      const response = await fetch('/api/surveys', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: id, hasHouse, managementMethods: methods, managementOther, delayDuration, delayDurationOther, delayReason: reason, delayOther, source: params.get('utm_source') || 'direct', campaign: params.get('utm_campaign') || 'default', variant: params.get('utm_content') || 'default' }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '응답 저장에 실패했습니다.')
      setSaved({ id: result.id, requestId: id }); setSavedHasHouse(result.hasHouse)
    } catch (err) { setError(err instanceof Error ? err.message : '연결을 확인하고 다시 제출해주세요.') }
    finally { setSending(false) }
  }
  return <section className="section container survey-section" id="survey" aria-labelledby="survey-title">
    <div className="section-heading"><span className="eyebrow">START WITH YOUR EXPERIENCE</span><h2 id="survey-title">멀리 있는 집,<br />어떻게 관리하고 계신가요?</h2><p>최대 4개 질문 · 약 1분 · 설문만 제출할 때는 연락처가 필요 없어요.</p></div>
    <div className="survey-panel">
      {saved ? <div className="survey-complete" role="status"><CheckCircle2 size={30} /><h3>응답을 저장했어요. 감사합니다.</h3>{savedHasHouse ? <><p>직접 방문하기 어려운 집,<br />가까운 지역 주민이 대신 확인해주는 서비스는 어떠세요?</p><div className="survey-offer"><span className="eyebrow">현재 개발 중 · 사전 신청 접수</span><h3><House size={21} /> 외부 점검 1회 · {priceLabel}원</h3><p>합의한 외부 구역을 방문하고 사진과 점검 결과를 전달합니다.<br />실내 출입·청소·수리·긴급 출동은 포함되지 않습니다.</p><SurveyReportPreview /><span className="survey-coupon"><Ticket size={17} /> 사전 신청 시 첫 이용 {discountLabel}원 할인 쿠폰</span><button className="button" onClick={() => onApply(saved)}>시범 서비스 신청 의향 남기기 <ArrowRight size={18} /></button><p className="form-note">출시 후 운영 지역과 최종 조건을 확인하고 결제합니다. 지금 결제되지 않습니다.</p></div></> : <p>별도로 관리하는 주택이 없다는 응답도<br />서비스 수요를 파악하는 데 참고하겠습니다.<br />메인 화면에서 준비 중인 서비스를 살펴보실 수 있어요.</p>}</div> : <form onSubmit={submit} onChange={start} className="survey-form">
        <fieldset><legend><span>Q1</span> 현재 거주하는 집 외에 별도로 관리하는 주택이 있으신가요?</legend><p className="survey-help">상속받은 시골집, 빈집, 주말주택, 세컨드하우스 등. 현재 거의 관리하지 않는 주택도 포함해 주세요.</p><div className="survey-options">{[[true, '네, 있습니다.'], [false, '아니요, 없습니다.']].map(([value, label]) => <label key={String(value)} className="survey-option"><input type="radio" name="hasHouse" required checked={hasHouse === value} onChange={() => { setHasHouse(value as boolean); setError('') }} />{label}</label>)}</div></fieldset>
        {hasHouse && <>
          <fieldset><legend><span>Q2</span> 해당 주택은 현재 어떻게 관리하고 계신가요?</legend><p className="survey-help">복수 선택 가능 · ‘거의 관리하지 않음’은 단독으로 선택합니다.</p><div className="survey-options">{managementOptions.map(method => <label key={method} className="survey-option"><input type="checkbox" checked={methods.includes(method)} onChange={() => toggleMethod(method)} />{method}</label>)}</div>{methods.includes('기타') && <label className="survey-other">기타 관리 방법<input required maxLength={300} value={managementOther} onChange={e => setManagementOther(e.target.value)} placeholder="이름·주소 등 개인정보는 적지 마세요" /></label>}</fieldset>
          <fieldset><legend><span>Q3</span> 가장 최근에 집 상태 확인이나 관리를 미뤘을 때, 얼마나 미루셨나요?</legend><p className="survey-help">원래 하려던 시점보다 늦어진 기간을 선택해주세요. 아직 하지 않았다면 현재까지 미룬 기간을 알려주세요.</p><div className="survey-options">{delayDurations.map(value => <label key={value} className="survey-option"><input type="radio" name="delayDuration" required checked={delayDuration === value} onChange={() => setDelayDuration(value)} />{value}</label>)}</div>{delayDuration === '직접 입력' && <label className="survey-other">실제로 미룬 기간<input required maxLength={100} value={delayDurationOther} onChange={e => setDelayDurationOther(e.target.value)} placeholder="예: 약 2개월, 10일 정도" /></label>}</fieldset>
          {delayed === true && <fieldset><legend><span>Q4</span> 관리를 미루게 된 가장 큰 이유는 무엇인가요?</legend><p className="survey-help">가장 큰 이유 한 가지를 선택해주세요.</p><div className="survey-options">{delayReasons.map(value => <label key={value} className="survey-option"><input type="radio" name="delayReason" required checked={reason === value} onChange={() => setReason(value)} />{value}</label>)}</div>{reason === '기타' && <label className="survey-other">기타 이유<input required maxLength={300} value={delayOther} onChange={e => setDelayOther(e.target.value)} placeholder="이름·주소 등 개인정보는 적지 마세요" /></label>}</fieldset>}
        </>}
        <p className="survey-data-note">응답과 유입 경로는 서비스 수요 조사에 활용하며 90일간 보관합니다. 이름·연락처·정확한 주소는 설문에서 받지 않습니다.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button survey-submit" disabled={sending} type="submit">{sending ? <><LoaderCircle size={18} className="spin" /> 응답 저장 중</> : <>설문 응답 제출하기 <ArrowRight size={18} /></>}</button>
      </form>}
    </div>
  </section>
}
