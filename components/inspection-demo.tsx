'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, Camera, Check, CheckCircle2, ClipboardList, Clock3, FileCheck2, House, Info, MapPin, RotateCcw, ShieldCheck, Ticket } from 'lucide-react'
import { PILOT_OFFER, priceLabel, discountLabel, firstPaymentLabel } from '@/lib/offer'
import { track } from '@/lib/client-tracking'

const areas = [
  { id: 'entrance', label: '대문 · 현관', image: '/images/report-entrance.webp', status: '특이사항 없음', tone: 'good', detail: '대문이 닫혀 있으며 현관 앞에 눈에 띄는 변화가 없습니다. 허용된 외부 구역에서만 확인했습니다.', alt: '닫힌 목조 주택 현관의 예시 사진' },
  { id: 'yard', label: '마당 · 진입로', image: '/images/report-yard.webp', status: '이상 발견', tone: 'warning', detail: '진입로에 나뭇가지가 떨어져 있습니다. 위치를 사진에 남겼으며 별도 제거 작업은 진행하지 않았습니다.', alt: '주택 진입로에 떨어진 나뭇가지의 예시 사진' },
  { id: 'window', label: '뒷면 창문', image: '/images/report-window-blocked.webp', status: '확인 불가', tone: 'neutral', detail: '울타리와 수풀에 가려 승인된 이동 구역에서는 창문 상태를 확인할 수 없었습니다. 출입 범위를 넘어 이동하지 않았습니다.', alt: '울타리와 수풀로 시야가 막힌 주택 뒷면의 예시 사진' },
]
const stages = [
  { title: '요청 접수', text: '희망 일정과 점검할 구역을 확인하고 있습니다.', time: '일정 조율 전', icon: ClipboardList },
  { title: '담당자 연결', text: '활동 지역과 일정을 확인하고, 외부 출입 범위를 합의합니다.', time: '방문 전', icon: MapPin },
  { title: '현장 점검 중', text: '합의한 구역의 상태를 확인하고 위치별 사진을 촬영합니다.', time: '방문 중', icon: Camera },
  { title: '리포트 검수 중', text: '사진 누락 여부와 관찰 내용을 확인하고 있습니다.', time: '방문 후', icon: FileCheck2 },
  { title: '점검 완료', text: '항목별 사진과 관찰 결과를 확인할 수 있습니다.', time: '결과 확인 가능', icon: CheckCircle2 },
]
const screens = [{ title: '점검 요청', icon: ClipboardList }, { title: '점검 진행 중', icon: Clock3 }, { title: '점검 결과', icon: FileCheck2 }]

export default function InspectionDemo() {
  const [screen, setScreen] = useState(0)
  const [stage, setStage] = useState(2)
  const [selected, setSelected] = useState('entrance')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState({ nickname: '우리 시골집', region: '충북 옥천군 (예시)', date: '', time: '오전', areas: areas.map(area => area.id), note: '', permission: false, coupon: false })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [surveyHref, setSurveyHref] = useState('/survey')
  useEffect(() => {
    track('demo_view')
    const incoming = new URLSearchParams(window.location.search)
    const initialScreen = ['request', 'progress', 'result'].indexOf(incoming.get('screen') || '')
    if (initialScreen >= 0) setScreen(initialScreen)
    const query = new URLSearchParams()
    for (const key of ['utm_source', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_term']) { const value = incoming.get(key); if (value) query.set(key, value) }
    setSurveyHref('/survey' + (query.size ? '?' + query.toString() : ''))
  }, [])
  const requested = areas.filter(area => fields.areas.includes(area.id))
  const active = requested.find(area => area.id === selected) || requested[0]
  const requestAreas = requested.map(area => area.label).join(', ')
  const amount = fields.coupon ? firstPaymentLabel : priceLabel
  const sampleDate = fields.date || '희망일 미선택 (예시 화면)'
  function goTo(index: number) {
    setScreen(index)
    if (index === 1) track('demo_progress')
    if (index === 2) track('demo_result')
  }
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % screens.length
    else if (event.key === 'ArrowLeft') next = (index + screens.length - 1) % screens.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = screens.length - 1
    else return
    event.preventDefault(); goTo(next); tabRefs.current[next]?.focus()
  }
  function toggleArea(id: string) {
    setFields(current => ({ ...current, areas: current.areas.includes(id) ? current.areas.filter(area => area !== id) : [...current.areas, id] }))
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!requested.length) { setError('확인할 구역을 한 가지 이상 선택해주세요.'); return }
    setError(''); setSubmitted(true); setStage(0); setSelected(requested[0].id); track('demo_request'); goTo(1)
  }
  function reset() {
    setSubmitted(false); setStage(2); setScreen(0); setSelected('entrance'); setError('')
    setFields({ nickname: '우리 시골집', region: '충북 옥천군 (예시)', date: '', time: '오전', areas: areas.map(area => area.id), note: '', permission: false, coupon: false })
  }
  const StageIcon = stages[stage].icon
  return <>
    <div className="demo-intro"><span className="eyebrow">TRY JIBON</span><h1>요청부터 집의 안부까지,<br />직접 살펴보세요.</h1><p>화면을 누르며 점검을 요청하고, 진행 상태와 예시 리포트를 확인해보세요.</p></div>
    <div className="demo-notice"><Info size={20} /><p><strong>실제 서비스가 아닌 체험 화면입니다.</strong> 방문·주민 매칭·결제는 발생하지 않으며 입력 내용은 서버에 저장하지 않습니다. 실제 주소·연락처는 입력하지 마세요.</p></div>
    <div className="demo-tabs" role="tablist" aria-label="점검 서비스 체험 화면">{screens.map((item, index) => <button key={item.title} type="button" role="tab" id={`demo-tab-${index}`} aria-controls="demo-panel" aria-selected={screen === index} tabIndex={screen === index ? 0 : -1} ref={element => { tabRefs.current[index] = element }} onClick={() => goTo(index)} onKeyDown={event => navigate(event, index)}><span className="demo-tab-number">0{index + 1}</span><item.icon size={18} /><span>{item.title}</span></button>)}</div>
    <div id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${screen}`} className="demo-panel">
      {screen === 0 && <div className="demo-request-layout">
        <form className="demo-card demo-request-form" onSubmit={submit}>
          <div className="demo-card-heading"><span className="eyebrow">REQUEST</span><h2>어디를 살펴볼까요?</h2><p>체험용 정보를 입력하면 다음 화면에서 확인할 수 있어요.</p></div>
          <label>주택 별칭 <span>*</span><input required maxLength={40} value={fields.nickname} onChange={e => setFields(current => ({ ...current, nickname: e.target.value }))} placeholder="예: 우리 시골집" /></label>
          <label>관리 지역 (체험용) <span>*</span><input required maxLength={60} minLength={2} value={fields.region} onChange={e => setFields(current => ({ ...current, region: e.target.value }))} placeholder="예: 충북 옥천군" /></label>
          <div className="demo-form-row"><label>희망 점검일 <span>*</span><input type="date" required value={fields.date} onChange={e => setFields(current => ({ ...current, date: e.target.value }))} /></label><label>희망 시간대<select value={fields.time} onChange={e => setFields(current => ({ ...current, time: e.target.value }))}><option>오전</option><option>오후</option><option>협의 후 결정</option></select></label></div>
          <p className="demo-field-help">희망 일정 입력 예시입니다. 실제 방문 일정은 담당자와 합의합니다.</p>
          <fieldset className="demo-area-fieldset"><legend>확인할 외부 구역 <span>*</span></legend>{areas.map(area => <label key={area.id} className="demo-check"><input type="checkbox" checked={fields.areas.includes(area.id)} onChange={() => toggleArea(area.id)} /><span>{area.label}</span></label>)}</fieldset>
          <label>특히 확인하고 싶은 점<textarea rows={3} maxLength={300} value={fields.note} onChange={e => setFields(current => ({ ...current, note: e.target.value }))} placeholder="예: 진입로에 나뭇가지가 떨어져 있는지 확인해주세요." /></label>
          <label className="demo-check demo-permission"><input type="checkbox" required checked={fields.permission} onChange={e => setFields(current => ({ ...current, permission: e.target.checked }))} /><span>체험상 요청한 주택의 관리 권한이 있고, 합의한 외부 구역만 확인하는 조건을 이해했습니다.</span></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="button">이 조건으로 점검 요청 체험하기 <ArrowRight size={18} /></button>
        </form>
        <aside className="demo-card demo-order-summary"><div className="demo-summary-image"><img src="/images/country-home.jpg" alt="체험용 주택 이미지" /><span>SAMPLE HOME</span></div><h3>외부 점검 1회</h3><p className="demo-summary-description">사진과 관찰 결과로 집의 안부를 확인해요.</p><dl><div><dt>주택</dt><dd>{fields.nickname || '주택 별칭 미입력'}</dd></div><div><dt>희망 일정</dt><dd>{fields.date || '날짜를 선택해주세요'}<br />{fields.time}</dd></div><div><dt>점검 구역</dt><dd>{requestAreas || '구역을 선택해주세요'}</dd></div></dl><div className="demo-cost"><span>1회 점검 요금</span><strong>{priceLabel}원</strong></div><label className="demo-check demo-coupon"><input type="checkbox" checked={fields.coupon} onChange={e => setFields(current => ({ ...current, coupon: e.target.checked }))} /><span><Ticket size={16} /> 첫 이용 {discountLabel}원 쿠폰 적용 예시</span></label><div className="demo-total"><span>결제 금액 예시</span><strong>{amount}원</strong></div><p className="demo-field-help">체험에서는 결제되지 않으며 실제 쿠폰도 발급·사용되지 않습니다.</p><div className="demo-scope"><ShieldCheck size={18} /><p>외부 상태 확인과 보고만 포함됩니다. 실내 출입·청소·수리·긴급 출동은 포함되지 않습니다.</p></div></aside>
      </div>}
      {screen === 1 && <div className="demo-progress-layout">
        <div className="demo-card"><div className="demo-card-heading"><span className="eyebrow">IN PROGRESS · SAMPLE</span><h2>{stages[stage].title}</h2><p>{submitted ? '입력한 요청 조건으로 진행 과정을 체험하고 있어요.' : '요청 없이도 진행 화면을 미리 살펴볼 수 있어요.'}</p></div><div className="demo-current-stage"><span><StageIcon size={30} /></span><div><strong>{stages[stage].title}</strong><p>{stages[stage].text}</p></div></div><ol className="demo-timeline">{stages.map((item, index) => <li key={item.title} className={index < stage ? 'finished' : index === stage ? 'current' : ''}><span>{index < stage ? <Check size={15} /> : index + 1}</span><div><strong>{item.title}</strong><p>{item.time}</p></div>{index === stage && <em>현재 예시 단계</em>}</li>)}</ol><div className="demo-step-actions"><button type="button" className="demo-secondary-button" onClick={() => goTo(0)}><ArrowLeft size={16} /> 요청 조건 보기</button>{stage < stages.length - 1 ? <button type="button" className="button" onClick={() => setStage(value => Math.min(value + 1, stages.length - 1))}>다음 진행 단계 보기 <ArrowRight size={17} /></button> : <button type="button" className="button" onClick={() => goTo(2)}>점검 결과 보기 <ArrowRight size={17} /></button>}</div></div>
        <aside className="demo-card demo-progress-summary"><span className="demo-sample-label">체험용 요청</span><h3><House size={21} /> {fields.nickname || '우리 시골집'}</h3><p><MapPin size={15} /> {fields.region || '지역 미입력'}</p><dl><div><dt>희망 일정</dt><dd>{sampleDate} · {fields.time}</dd></div><div><dt>확인 구역</dt><dd>{requestAreas || '선택한 구역 없음'}</dd></div><div><dt>요청 사항</dt><dd>{fields.note || '별도 요청 사항 없음'}</dd></div></dl><div className="demo-scope"><Clock3 size={19} /><p>진행 단계는 버튼으로 직접 넘기는 예시입니다. 실제 주민이 방문하거나 실시간 위치를 추적하지 않습니다.</p></div></aside>
      </div>}
      {screen === 2 && <div className="demo-card demo-result-card"><div className="demo-result-header"><div><span className="eyebrow">INSPECTION REPORT · SAMPLE</span><h2>{fields.nickname || '우리 시골집'}의 점검 결과</h2><p><CalendarDays size={15} /> {sampleDate} · 점검 시각 예시 10:30</p></div><span className="demo-complete-badge"><CheckCircle2 size={16} /> 점검 완료 예시</span></div><div className="demo-result-totals"><span><strong>{requested.length}</strong> 요청 구역</span><span><strong>{requested.filter(area => area.tone === 'good').length}</strong> 특이사항 없음</span><span><strong>{requested.filter(area => area.tone === 'warning').length}</strong> 이상 발견</span><span><strong>{requested.filter(area => area.tone === 'neutral').length}</strong> 확인 불가</span></div>
        {active ? <div className="demo-result-layout"><div className="demo-result-photo"><img src={active.image} alt={active.alt} /><span><Camera size={15} /> {active.label} · 촬영 예시</span></div><div className="demo-result-details"><div className="demo-result-areas" aria-label="위치별 점검 결과">{requested.map(area => <button type="button" key={area.id} aria-pressed={active.id === area.id} onClick={() => setSelected(area.id)} className={active.id === area.id ? 'selected' : ''}><strong>{area.label}</strong><span className={`result-status ${area.tone}`}>{area.status}</span></button>)}</div><div className="demo-result-observation" aria-live="polite"><h3>{active.label}</h3><span className={`result-status ${active.tone}`}>{active.status}</span><p>{active.detail}</p></div></div></div> : <p className="demo-empty">선택한 점검 구역이 없습니다. 요청 화면에서 구역을 선택해주세요.</p>}
        <div className="demo-result-note"><ShieldCheck size={20} /><p>AI로 제작한 예시 사진과 가상의 관찰 내용입니다. 실제 점검 결과가 아니며, 점검 중 발견된 문제의 수리·제거는 별도 작업입니다.</p></div><div className="demo-result-actions"><button type="button" className="demo-secondary-button" onClick={reset}><RotateCcw size={17} /> 처음부터 다시 체험하기</button><Link href={surveyHref} className="button">우리 집도 필요하다면, 설문 참여하기 <ArrowRight size={17} /></Link></div>
      </div>}
    </div>
  </>
}
