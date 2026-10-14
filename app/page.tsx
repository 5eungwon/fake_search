'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ArrowRight, Check, ChevronDown, House, MapPin, Camera, CalendarDays, ShieldCheck, DoorOpen, Trees, ScanLine, X, CheckCircle2, LoaderCircle, Menu, Clock3, FileCheck2 } from 'lucide-react'

function attribution() {
  const params = new URLSearchParams(window.location.search)
  return { source: params.get('utm_source') || 'direct', campaign: params.get('utm_campaign') || 'default', variant: params.get('utm_content') || 'default' }
}
function track(event: string, placement?: string) {
  fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event, placement, ...attribution() }), keepalive: true }).catch(() => {})
}
const reportItems = [
  { name: '대문 · 현관', status: '특이사항 없음', text: '대문이 닫혀 있고, 현관 주변에 눈에 띄는 변화가 없습니다.', icon: DoorOpen, tone: 'good' },
  { name: '마당 · 진입로', status: '이상 발견', text: '진입로에 나뭇가지가 떨어져 있습니다. 사진으로 위치를 확인해주세요.', icon: Trees, tone: 'warning' },
  { name: '뒷면 창문', status: '확인 불가', text: '승인된 이동 구역에서 보이지 않아 확인하지 못했습니다.', icon: ScanLine, tone: 'neutral' },
]
const faqs = [
  ['어느 지역에서 이용할 수 있나요?', '현재 시범 운영 수요를 확인하고 있습니다. 신청해주신 시·군을 바탕으로 한 지역부터 운영할 예정이며, 해당 지역에서 점검자를 연결할 수 있는지 확인한 뒤 개별 안내드립니다. 신청만으로 방문이 확정되지는 않습니다.'],
  ['집 안도 확인해주나요?', '초기 시범 점검은 소유자와 합의한 외부 구역만 확인합니다. 실내 출입과 열쇠 보관은 하지 않으며, 청소·수리·제초 등의 작업은 기본 점검에 포함되지 않습니다.'],
  ['누가 방문하고, 어떻게 확인하나요?', '시범 운영에서는 본인과 활동 지역 확인 및 기본 안내를 거친 지역 주민을 연결할 계획입니다. 소유자의 관리 권한과 출입 허용 범위를 먼저 확인하고, 지정 위치의 사진·방문 시각·관찰 결과를 검수하는 방식으로 운영합니다.'],
  ['이상이 발견되면 바로 처리해주나요?', '발견한 상태를 사진과 관찰 내용으로 전달합니다. 실시간 감시나 긴급 출동, 문제 예방을 보장하는 서비스는 아닙니다. 점검자는 위험 상황에 직접 개입하지 않으며, 필요한 조치는 소유자가 판단합니다.'],
  ['신청하면 바로 결제되나요?', '아니요. 지금은 유료 시범 서비스 참여 의향을 받는 단계입니다. 예상 요금은 월 1회 15,000원이며, 지역·이동 거리·점검 범위를 확인한 뒤 최종 요금을 안내합니다. 조건에 동의한 경우에만 별도로 결제합니다.'],
]

export default function Home() {
  const [formOpen, setFormOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [report, setReport] = useState(0)
  const [step, setStep] = useState(1)
  const [sending, setSending] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState('')
  const [requestId, setRequestId] = useState('')
  const [applicationId, setApplicationId] = useState('')
  const [started, setStarted] = useState(false)
  const [fields, setFields] = useState({ ownership: '', houseType: '', region: '', lastVisit: '', purpose: '', currentMethod: '', frequency: '월 1회', priceIntent: '', contact: '', consent: false, interviewConsent: false, website: '' })
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  useEffect(() => { track('landing_view') }, [])
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
  function openForm(placement: string) {
    track('apply_click', placement)
    setRequestId(current => current || crypto.randomUUID())
    setMobileMenu(false)
    setFormOpen(true)
  }
  function update(name: string, value: string | boolean) {
    if (!started) { track('form_start'); setStarted(true) }
    setFields(current => ({ ...current, [name]: value }))
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step === 1) { track('form_step_complete'); setStep(2); dialogRef.current?.querySelector<HTMLElement>('select')?.focus(); return }
    setSending(true); setError('')
    try {
      const response = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...fields, requestId, ...attribution() }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '신청을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.')
      setApplicationId(result.id); setComplete(true)
    } catch (err) { setError(err instanceof Error ? err.message : '연결을 확인하고 다시 시도해주세요.') }
    finally { setSending(false) }
  }
  const activeReport = reportItems[report]
  return (
    <>
      <header className="site-header">
        <div className="container nav-row">
          <a className="logo" href="#" aria-label="집온 홈"><House size={27} strokeWidth={2.2} /><span>집온<span className="logo-dot">.</span></span></a>
          <nav className={mobileMenu ? 'nav-links mobile-open' : 'nav-links'} aria-label="주 메뉴">
            <a href="#service" onClick={() => setMobileMenu(false)}>서비스 소개</a><a href="#report" onClick={() => setMobileMenu(false)}>점검 리포트</a><a href="#pricing" onClick={() => setMobileMenu(false)}>이용 요금</a><a href="#faq" onClick={() => setMobileMenu(false)}>자주 묻는 질문</a>
          </nav>
          <div className="nav-actions"><button className="button button-small" onClick={() => openForm('header')}>시범 운영 신청 <ArrowUpRight size={16} /></button><button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="메뉴 열기" aria-expanded={mobileMenu}>{mobileMenu ? <X /> : <Menu />}</button></div>
        </div>
      </header>
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow pill"><span className="status-dot" /> 멀리 있는 집을 위한, 새로운 안부</span>
            <h1>우리 집은 멀리 있어도,<br /><span>안심은 가까이.</span></h1>
            <p className="hero-description">시골집, 주말주택, 부모님이 남겨주신 집.<br />확인하러 가기 어려운 날엔 가까운 이웃이 대신 살펴보고,<br className="desktop-break" /> 사진과 점검 결과로 집의 안부를 전합니다.</p>
            <div className="hero-buttons"><button className="button" onClick={() => openForm('hero')}>우리 집 시범 점검 신청하기 <ArrowUpRight size={19} /></button><a className="text-link" href="#report" onClick={() => track('report_view', 'hero')}>어떤 리포트를 받나요? <ArrowRight size={17} /></a></div>
            <p className="hero-note"><Check size={15} /> 예상 월 1회 15,000원 <span>·</span> 신청 단계에서는 결제하지 않아요</p>
            <div className="hero-bottom"><span>집까지 가지 않아도,</span><strong>약속한 확인은 이루어지도록.</strong><div className="small-line" /></div>
          </div>
          <div className="hero-visual">
            <img className="hero-photo" src="/images/country-home.jpg" alt="초록 나무와 마당으로 둘러싸인 조용한 주택" fetchPriority="high" />
            <div className="photo-caption"><span><MapPin size={14} /> 가까운 이웃이 전하는 집의 안부</span><span>서비스 이해를 위한 이미지</span></div>
            <div className="visit-float"><span className="visit-icon"><House size={22} /></span><div><span className="float-label">우리 집 외부 점검</span><strong>사진으로 확인하는 오늘의 집</strong></div><span className="check-circle"><Check size={16} /></span></div>
            <div className="photo-tag"><span className="status-dot" /> YOUR HOME, CHECKED.</div>
          </div>
        </section>
        <div className="trust-strip"><div className="container trust-items"><span><MapPin /> 가까운 지역 주민의 방문</span><span><Camera /> 지정 구역 사진과 관찰 결과</span><span><ShieldCheck /> 합의한 외부 구역만 확인</span></div></div>

        <section className="section container problem-section" id="service">
          <div className="section-heading"><span className="eyebrow">A LITTLE CLOSER TO HOME</span><h2>집이 멀어질수록,<br />작은 확인도 큰 일이 되니까.</h2><p>그저 잘 있는지 알고 싶은데, 매번 직접 가기는 어렵죠.</p></div>
          <div className="problem-grid">
            <article><span className="number">01 / DISTANCE</span><div className="problem-icon"><Clock3 /></div><h3>잠깐 확인하려고,<br />하루를 비우는 일</h3><p>대문은 닫혔는지, 마당은 괜찮은지.<br />작은 확인을 위해 오가는 긴 거리.</p></article>
            <article><span className="number">02 / FAVOR</span><div className="problem-icon"><House /></div><h3>이웃에게 또 부탁하기,<br />조금은 미안한 마음</h3><p>이번에도 봐달라는 말을 꺼내기 어렵고,<br />언제 확인했는지 다시 묻기도 망설여져요.</p></article>
            <article><span className="number">03 / UNCERTAINTY</span><div className="problem-icon"><ScanLine /></div><h3>오래 비워둔 집,<br />문득 떠오르는 걱정</h3><p>지난번 다녀왔을 때와 달라진 건 없는지.<br />지금 상태를 사진으로 확인하고 싶어요.</p></article>
          </div>
        </section>

        <section className="report-section" id="report"><div className="container report-layout">
          <div className="report-copy"><span className="eyebrow">SEE IT. KNOW IT.</span><h2>“다녀왔어요” 한마디보다,<br /><span>직접 볼 수 있는 기록.</span></h2><p>정해진 위치의 사진과 방문 시각,<br />눈에 보이는 변화까지 담아 전달합니다.<br />확인하지 못한 곳도 분명하게 알려드려요.</p><div className="report-features"><span><CheckCircle2 /> 위치별 사진과 점검 결과</span><span><CheckCircle2 /> 특이사항 없음 · 이상 발견 · 확인 불가 구분</span><span><CheckCircle2 /> 이전 기록과 비교할 수 있는 점검 이력</span></div><div className="sample-note"><FileCheck2 size={20} /><p>오른쪽은 <strong>점검 리포트 예시</strong>입니다.<br />실제 고객의 점검 결과가 아닙니다.</p></div></div>
          <div className="report-card"><div className="report-card-top"><span className="report-brand"><House size={18} /> 집온 리포트</span><span className="sample-badge">SAMPLE</span></div><div className="report-title"><div><span>외부 상태 확인</span><h3>우리 집의 오늘</h3></div><span className="report-date">방문 일시 예시<br /><strong>10.14 · 10:30</strong></span></div><div className="report-photo"><img src="/images/country-home.jpg" alt="점검 리포트에 첨부되는 주택 사진 예시" loading="lazy" /><span><Camera size={13} /> 지정 위치 촬영 예시</span></div><div className="report-tabs" role="tablist" aria-label="점검 항목 예시">{reportItems.map((item, index) => <button role="tab" aria-selected={report === index} aria-controls="report-result" id={`report-tab-${index}`} className={report === index ? 'active' : ''} key={item.name} onClick={() => { setReport(index); track('report_view', item.name) }}>{item.name}</button>)}</div><div id="report-result" role="tabpanel" aria-labelledby={`report-tab-${report}`} className="report-result"><div><activeReport.icon size={18} /><strong>{activeReport.name}</strong><span className={`result-status ${activeReport.tone}`}>{activeReport.status}</span></div><p>{activeReport.text}</p></div><div className="report-footer"><ShieldCheck size={14} /> 허용된 외부 구역에서 관찰한 상태를 기록합니다.</div></div>
        </div></section>

        <section className="section container how-section"><div className="section-heading centered"><span className="eyebrow">HOW IT WORKS</span><h2>신청은 간단하게, 확인은 꼼꼼하게.</h2><p>우리 집에 필요한 확인부터 함께 정합니다.</p></div><div className="steps">{[{ icon: MapPin, title: '지역과 주택 정보 남기기', text: '관리 중인 주택의 시·군과\n필요한 점검 주기를 알려주세요.' }, { icon: CalendarDays, title: '가능 지역 · 방문 범위 확인', text: '점검자를 연결할 수 있는지 확인하고,\n방문 범위와 최종 요금을 합의합니다.' }, { icon: Camera, title: '방문 후 리포트 받기', text: '합의한 외부 구역을 방문하고,\n사진과 관찰 결과를 전달합니다.' }].map((item, index) => <article key={item.title}><div className="step-icon"><item.icon size={26} /><span>0{index + 1}</span></div><h3>{item.title}</h3><p>{item.text}</p>{index < 2 && <ArrowRight className="step-arrow" size={23} />}</article>)}</div><div className="scope-note"><ShieldCheck size={20} /><p>초기에는 <strong>실내 출입과 열쇠 보관 없이, 승인된 외부 구역만</strong> 확인해요.<br className="mobile-break" /> 실시간 감시 · 긴급 출동 · 청소 · 수리는 포함되지 않습니다.</p></div></section>

        <section className="pricing-section" id="pricing"><div className="container pricing-layout"><div><span className="eyebrow">A SMALL VISIT, A LITTLE PEACE</span><h2>한 달에 한 번,<br />우리 집 안부를 받아보세요.</h2><p>먼 길을 떠나기 전, 집의 상태부터 확인할 수 있도록.<br />소수 가구와 함께 시범 서비스를 준비하고 있습니다.</p><span className="pilot-tag"><span className="status-dot" /> 시범 운영 참여 의향 모집 중</span></div><div className="price-card"><div className="price-top"><span>외부 점검 시범 서비스</span><span>예상 요금</span></div><div className="price">15,000<span>원 / 월</span></div><p className="price-caption">월 1회 방문 기준 · 확정 요금이 아닙니다</p><ul><li><Check /> 대문·현관, 창문·외벽, 마당·진입로 확인</li><li><Check /> 사전 합의한 위치의 사진과 관찰 결과</li><li><Check /> 방문 기록과 항목별 상태 리포트</li></ul><button className="button" onClick={() => openForm('pricing')}>이 조건으로 시범 운영 신청 <ArrowUpRight size={18} /></button><p className="price-disclaimer">지역·이동 거리·점검 범위에 따라 최종 요금을 안내합니다.<br />신청 시 결제되지 않으며, 방문 가능 여부 확인 후 진행합니다.</p></div></div></section>

        <section className="section container faq-section" id="faq"><div className="section-heading"><span className="eyebrow">GOOD TO KNOW</span><h2>신청 전에 궁금한 것들.</h2><p>처음 맡기는 일이니까, 충분히 알고 결정하세요.</p></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={19} /></summary><p>{answer}</p></details>)}</div></section>
        <section className="final-cta container"><div className="cta-house"><House size={35} strokeWidth={1.5} /></div><span className="eyebrow">멀리 있어도, 마음은 그 집에.</span><h2>다음 확인은, 집온과 함께.</h2><p>우리 집에도 필요한 서비스인지, 시범 운영으로 확인해보세요.</p><button className="button" onClick={() => openForm('bottom')}>시범 점검 신청하기 <ArrowUpRight size={18} /></button><span className="final-note">약 2분 소요 · 신청 단계 결제 없음</span></section>
      </main>
      <footer className="footer container"><a className="logo" href="#"><House size={23} /><span>집온<span className="logo-dot">.</span></span></a><p>집의 안부를 전하는, 가까운 연결.</p><span>© {new Date().getFullYear()} 집온 · 시범 서비스 준비 중</span></footer>
      <div className="mobile-cta"><div><strong>월 1회 15,000원</strong><span>예상 시범 요금 · 결제 없음</span></div><button className="button button-small" onClick={() => openForm('mobile_sticky')}>시범 신청 <ArrowUpRight size={16} /></button></div>

      <dialog ref={dialogRef} className="application-dialog" onCancel={() => setFormOpen(false)} onClick={event => { if (event.target === event.currentTarget) setFormOpen(false) }} aria-labelledby="application-title">
        <div className="dialog-content"><button className="close-button" aria-label="신청창 닫기" onClick={() => setFormOpen(false)}><X size={22} /></button>
          {complete ? <div className="success-content"><span className="success-icon"><CheckCircle2 size={36} /></span><span className="eyebrow">THANK YOU FOR YOUR INTEREST</span><h2 id="application-title">참여 의향을 잘 받았어요.</h2><p>남겨주신 지역과 점검 조건을 확인한 뒤,<br />시범 운영이 가능한 경우 연락드리겠습니다.</p><div className="success-summary"><strong>아직 방문이나 결제가 확정된 것은 아니에요.</strong><p>최종 범위와 요금을 안내받은 후 진행 여부를 결정하실 수 있습니다.</p><span>접수 번호 {applicationId.slice(0, 8).toUpperCase()}</span></div><button className="button" onClick={() => setFormOpen(false)}>확인했어요 <Check size={18} /></button></div> : <><span className="eyebrow">PILOT APPLICATION</span><h2 id="application-title">우리 집의 안부를 맡겨볼까요?</h2><p className="dialog-intro">시범 운영을 준비하고 있어요. 필요한 조건을 알려주시면<br />방문 가능 여부를 확인하고 안내드리겠습니다.</p><div className="form-progress"><span className={step === 1 ? 'current' : 'done'}>01 우리 집 이야기</span><span className={step === 2 ? 'current' : ''}>02 이용 조건과 연락처</span></div>
          <form onSubmit={submit}>
            {step === 1 ? <div className="form-fields">
              <label>현재 주택을 관리하고 계신가요? <span>*</span><select required value={fields.ownership} onChange={e => update('ownership', e.target.value)}><option value="">선택해주세요</option><option>소유자이며 직접 관리하고 있어요</option><option>가족 소유 주택을 관리하고 있어요</option><option>아직 관리 중인 주택은 없어요</option></select></label>
              <div className="form-row"><label>주택 유형 <span>*</span><select required value={fields.houseType} onChange={e => update('houseType', e.target.value)}><option value="">선택해주세요</option><option>상속받은 시골집</option><option>주말주택 / 세컨드하우스</option><option>비워둔 단독주택</option><option>기타 주택</option></select></label><label>관리 지역 (시·군) <span>*</span><input required minLength={2} maxLength={60} placeholder="예: 충북 옥천군" value={fields.region} onChange={e => update('region', e.target.value)} /></label></div>
              <p className="field-help">정확한 주소나 집을 비우는 일정은 입력하지 마세요.</p>
              <label>마지막으로 방문한 시기 <span>*</span><select required value={fields.lastVisit} onChange={e => update('lastVisit', e.target.value)}><option value="">선택해주세요</option><option>1개월 이내</option><option>1~3개월 전</option><option>3~6개월 전</option><option>6개월 이상 전</option><option>아직 방문한 적 없어요</option></select></label>
              <label>최근 방문의 가장 큰 목적은 무엇이었나요? <span>*</span><select required value={fields.purpose} onChange={e => update('purpose', e.target.value)}><option value="">실제 최근 경험을 골라주세요</option><option>집의 외부 상태 확인</option><option>실내 상태 / 누수 확인</option><option>청소 / 수리 / 제초</option><option>휴식 / 가족 방문</option><option>기타 / 방문한 적 없음</option></select></label>
              <label>지금은 집 상태를 어떻게 확인하시나요? <span>*</span><select required value={fields.currentMethod} onChange={e => update('currentMethod', e.target.value)}><option value="">선택해주세요</option><option>직접 방문</option><option>이웃 / 지인에게 부탁</option><option>CCTV / 원격 장비</option><option>관리인 / 기존 서비스</option><option>별도로 확인하지 않음</option></select></label>
              <button className="button form-submit" type="submit">다음: 이용 조건 확인 <ArrowRight size={18} /></button>
            </div> : <div className="form-fields"><div className="form-price"><House size={24} /><div><strong>월 1회 외부 점검 · 예상 15,000원</strong><span>실내 출입·청소·수리 제외 / 최종 조건은 별도 안내</span></div></div>
              <label>희망 점검 주기 <span>*</span><select required value={fields.frequency} onChange={e => update('frequency', e.target.value)}><option>월 1회</option><option>월 2회</option><option>필요할 때 1회</option><option>상담 후 결정</option></select></label>
              <label>위 시범 요금으로 이용할 의향이 있으신가요? <span>*</span><select required value={fields.priceIntent} onChange={e => update('priceIntent', e.target.value)}><option value="">솔직한 의견을 알려주세요</option><option>조건이 맞으면 유료로 이용하고 싶어요</option><option>리포트를 더 확인한 후 결정하고 싶어요</option><option>가격이 부담돼요</option><option>외부 점검만으로는 부족해요</option><option>지역 주민의 방문이 걱정돼요</option><option>지금은 필요하지 않아요</option></select></label>
              <label>안내받을 연락처 <span>*</span><input required maxLength={100} autoComplete="email" placeholder="휴대폰 번호 또는 이메일" value={fields.contact} onChange={e => update('contact', e.target.value)} /></label>
              <div className="privacy-notice"><strong>개인정보 수집·이용 안내</strong><p>수집 항목: 연락처, 주택 유형·관리 지역, 방문·관리 경험, 이용 의향, 유입 경로.<br />목적: 시범 운영 가능 여부 확인과 참여 안내.<br />보유 기간: 접수일로부터 90일 후 삭제. 동의를 거부할 수 있으며, 거부 시 신청이 어렵습니다. 철회는 시범 운영 안내 연락에 회신해주세요.</p></div>
              <label className="checkbox-label"><input type="checkbox" required checked={fields.consent} onChange={e => update('consent', e.target.checked)} /><span>[필수] 개인정보 수집·이용에 동의합니다.</span></label>
              <label className="checkbox-label"><input type="checkbox" checked={fields.interviewConsent} onChange={e => update('interviewConsent', e.target.checked)} /><span>[선택] 주택 관리 경험 인터뷰 연락에도 동의합니다.</span></label>
              <div className="honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={fields.website} onChange={e => update('website', e.target.value)} /></label></div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="form-actions"><button type="button" className="back-button" disabled={sending} onClick={() => setStep(1)}>이전</button><button className="button" disabled={sending} type="submit">{sending ? <><LoaderCircle className="spin" size={18} /> 접수 중</> : <>참여 의향 제출하기 <ArrowUpRight size={18} /></>}</button></div><p className="form-note">신청만으로 결제되거나 방문이 확정되지 않습니다.</p>
            </div>}
          </form></>}
        </div>
      </dialog>
    </>
  )
}
