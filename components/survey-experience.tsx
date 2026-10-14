'use client'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, House, X, CheckCircle2, LoaderCircle, Ticket } from 'lucide-react'
import HousingSurvey from '@/components/housing-survey'
import { attribution, track } from '@/lib/client-tracking'
import { PILOT_OFFER, priceLabel, discountLabel, firstPaymentLabel, paidIntent } from '@/lib/offer'
type IssuedCoupon = { code: string; expiresAt: string }

export default function SurveyExperience() {
  const [formOpen, setFormOpen] = useState(false)
  const [surveyLink, setSurveyLink] = useState<{ id: string; requestId: string } | null>(null)
  const [sending, setSending] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState('')
  const [requestId, setRequestId] = useState('')
  const [applicationId, setApplicationId] = useState('')
  const [started, setStarted] = useState(false)
  const [coupon, setCoupon] = useState<IssuedCoupon | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [fields, setFields] = useState({ region: '', priceIntent: paidIntent, priceConfirmed: false, contact: '', consent: false, interviewConsent: false, website: '' })
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  useEffect(() => { track('survey_view') }, [])
  useEffect(() => {
    if (formOpen) {
      previousFocus.current = document.activeElement as HTMLElement
      dialogRef.current?.showModal()
      const before = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = before; previousFocus.current?.focus() }
    }
    dialogRef.current?.close()
  }, [formOpen])
  function update(name: string, value: string | boolean) {
    if (!started) { track('form_start'); setStarted(true) }
    setFields(current => ({ ...current, [name]: value }))
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!surveyLink) { setError('먼저 설문 응답을 제출해주세요.'); return }
    setSending(true); setError('')
    try {
      const response = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...fields, surveyId: surveyLink?.id, surveyRequestId: surveyLink?.requestId, requestId, offerVersion: PILOT_OFFER.version, ...attribution() }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '신청을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.')
      setApplicationId(result.id); setCoupon(result.coupon || null); setCouponError(result.couponPending ? '신청은 저장됐지만 쿠폰 발급을 완료하지 못했습니다. 아래 버튼으로 다시 받아주세요.' : ''); setComplete(true)
    } catch (err) { setError(err instanceof Error ? err.message : '연결을 확인하고 다시 시도해주세요.') }
    finally { setSending(false) }
  }
  async function claimCoupon() {
    setCouponLoading(true); setCouponError('')
    try {
      const response = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId, applicationId }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '쿠폰을 발급하지 못했습니다. 다시 시도해주세요.')
      setCoupon(result.coupon)
    } catch (err) { setCouponError(err instanceof Error ? err.message : '연결을 확인하고 다시 시도해주세요.') }
    finally { setCouponLoading(false) }
  }
  const isPaidReservation = fields.priceIntent === paidIntent && fields.priceConfirmed
  return (<>
      <HousingSurvey onApply={survey => { setSurveyLink(survey); setRequestId(current => current || crypto.randomUUID()); track('survey_offer_click'); track('apply_click', 'survey_complete'); setFormOpen(true) }} />
      <dialog ref={dialogRef} className="application-dialog" onCancel={() => setFormOpen(false)} onClick={event => { if (event.target === event.currentTarget) setFormOpen(false) }} aria-labelledby="application-title">
        <div className="dialog-content"><button className="close-button" aria-label="예약창 닫기" onClick={() => setFormOpen(false)}><X size={22} /></button>
          {complete ? <div className="success-content"><span className="success-icon"><CheckCircle2 size={36} /></span><span className="eyebrow">{isPaidReservation ? 'RESERVATION RECEIVED' : 'THANK YOU FOR YOUR FEEDBACK'}</span><h2 id="application-title">{isPaidReservation ? '사전 신청을 받았어요.' : '이용 의견을 잘 받았어요.'}</h2><p>아직 서비스 개발 중입니다.<br />출시 후 해당 지역에서 점검이 가능한 경우 연락드리겠습니다.</p><div className="success-summary"><strong>{isPaidReservation ? '월 1회 외부 점검 · ' + priceLabel + '원 이용 의향 확인' : '남겨주신 의견은 서비스 준비에 참고하겠습니다.'}</strong><p>현재 결제된 금액은 0원입니다. 운영 시작 후 최종 조건을 확인하고 진행 여부를 결정하세요.</p><span>접수 번호 {applicationId.slice(0, 8).toUpperCase()}</span></div>
            {isPaidReservation && <div className="coupon-card"><div className="coupon-heading"><Ticket size={22} /><strong>사전 신청 첫 이용 할인 쿠폰</strong></div><p>첫 결제 <strong>{discountLabel}원 할인</strong><br />기본 요금 기준 첫 결제 {firstPaymentLabel}원 · 이후 월 {priceLabel}원</p>{coupon ? <div className="issued-coupon" role="status"><span>쿠폰 발급 완료 · 코드를 보관해주세요</span><strong>{coupon.code}</strong><span>유효기간: {new Date(coupon.expiresAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}까지</span></div> : <button type="button" className="button coupon-button" disabled={couponLoading} onClick={claimCoupon}>{couponLoading ? <><LoaderCircle className="spin" size={17} /> 발급 중</> : <>쿠폰 발급 다시 시도 <Ticket size={17} /></>}</button>}<p className="coupon-terms">예약 접수일부터 {PILOT_OFFER.couponValidityDays}일 · 첫 결제 1회 · 다른 할인과 중복 불가.<br />점검 가능 지역에 한해 적용하며, 이용 안내에 쿠폰 코드를 알려주세요.<br />쿠폰을 받는 것만으로 결제되거나 방문이 확정되지는 않습니다.</p>{couponError && <p className="form-error" role="alert">{couponError}</p>}</div>}
            <button className="button" onClick={() => setFormOpen(false)}>확인했어요 <Check size={18} /></button></div> : <><span className="eyebrow">PRE-LAUNCH APPLICATION</span><h2 id="application-title">우리 집의 안부를 맡겨볼까요?</h2><p className="dialog-intro">월 1회 {priceLabel}원의 유료 시범 서비스입니다.<br />현재 개발 중입니다. 사전 신청하면 {discountLabel}원 할인 쿠폰을 드려요.<br />서비스 출시 후 최종 조건을 확인하고 결제하세요.</p>          <form onSubmit={submit}>
            <div className="form-fields">
              <div className="form-price"><House size={24} /><div><strong>월 1회 외부 점검 · {priceLabel}원</strong><span>실내 출입·청소·수리 제외 / 최종 조건은 별도 안내</span></div></div>
              <label>관리 지역 (시·군) <span>*</span><input required minLength={2} maxLength={60} placeholder="예: 충북 옥천군" value={fields.region} onChange={e => update('region', e.target.value)} /></label>
              <p className="field-help">정확한 주소나 집을 비우는 일정은 입력하지 마세요.</p>
              <label>안내받을 연락처 <span>*</span><input required maxLength={100} placeholder="휴대폰 번호 또는 이메일" value={fields.contact} onChange={e => update('contact', e.target.value)} /></label>
              <label className="checkbox-label price-confirmation"><input type="checkbox" required checked={fields.priceConfirmed} onChange={e => update('priceConfirmed', e.target.checked)} /><span>[필수] 월 1회 외부 점검을 {priceLabel}원에 이용할 의향이 있습니다. 출시 후 운영 지역과 최종 조건을 확인하고 결제합니다.</span></label>
              <div className="privacy-notice"><strong>개인정보 수집·이용 안내</strong><p>수집 항목: 관리 지역, 연락처, 연결된 설문 응답, 이용 의향·요금 확인, 유입 경로, 쿠폰 발급 기록.<br />목적: 시범 운영 가능 여부 확인과 참여 안내.<br />보유 기간: 접수일부터 90일. 동의를 거부할 수 있으며 거부 시 신청이 어렵습니다. 철회는 시범 운영 안내 연락에 회신해주세요.</p></div>
              <label className="checkbox-label"><input type="checkbox" required checked={fields.consent} onChange={e => update('consent', e.target.checked)} /><span>[필수] 개인정보 수집·이용에 동의합니다.</span></label>
              <label className="checkbox-label"><input type="checkbox" checked={fields.interviewConsent} onChange={e => update('interviewConsent', e.target.checked)} /><span>[선택] 주택 관리 경험 인터뷰 연락에도 동의합니다.</span></label>
              <div className="honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={fields.website} onChange={e => update('website', e.target.value)} /></label></div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button" disabled={sending} type="submit">{sending ? <><LoaderCircle className="spin" size={18} /> 접수 중</> : <>제출하고 쿠폰 받기 <ArrowUpRight size={18} /></>}</button>
              <p className="form-note">지금 결제되지 않습니다. 출시 후 조건을 확인하고 결제합니다.</p>
            </div>
          </form></>}
        </div>
      </dialog>
  </>)
}
