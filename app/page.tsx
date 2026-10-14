'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, ArrowRight, Check, ChevronDown, House, MapPin, Camera, CalendarDays, ShieldCheck, DoorOpen, Trees, ScanLine, X, CheckCircle2, Menu, Clock3, FileCheck2 } from 'lucide-react'

import { track } from '@/lib/client-tracking'

import { PILOT_OFFER, priceLabel, discountLabel, firstPaymentLabel } from '@/lib/offer'

const reportItems = [
  { name: '대문 · 현관', status: '특이사항 없음', text: '대문이 닫혀 있고, 현관 주변에 눈에 띄는 변화가 없습니다.', icon: DoorOpen, tone: 'good' },
  { name: '마당 · 진입로', status: '이상 발견', text: '진입로에 나뭇가지가 떨어져 있습니다. 사진으로 위치를 확인해주세요.', icon: Trees, tone: 'warning' },
  { name: '뒷면 창문', status: '확인 불가', text: '승인된 이동 구역에서 보이지 않아 확인하지 못했습니다.', icon: ScanLine, tone: 'neutral' },
]
const faqs = [
  ['현재 서비스를 이용할 수 있나요?', '현재 개발 단계로 아직 점검 서비스를 제공하지 않습니다. 사전 신청 수요를 확인하고 있으며, 신청해주신 시·군을 바탕으로 한 지역부터 운영할 예정이며, 해당 지역에서 점검자를 연결할 수 있는지 확인한 뒤 개별 안내드립니다. 신청만으로 방문이 확정되지는 않습니다.'],
  ['집 안도 확인해주나요?', '초기 시범 점검은 소유자와 합의한 외부 구역만 확인합니다. 실내 출입과 열쇠 보관은 하지 않으며, 청소·수리·제초 등의 작업은 기본 점검에 포함되지 않습니다.'],
  ['누가 방문하고, 어떻게 확인하나요?', '시범 운영에서는 본인과 활동 지역 확인 및 기본 안내를 거친 지역 주민을 연결할 계획입니다. 소유자의 관리 권한과 출입 허용 범위를 먼저 확인하고, 지정 위치의 사진·방문 시각·관찰 결과를 검수하는 방식으로 운영합니다.'],
  ['이상이 발견되면 바로 처리해주나요?', '발견한 상태를 사진과 관찰 내용으로 전달합니다. 실시간 감시나 긴급 출동, 문제 예방을 보장하는 서비스는 아닙니다. 점검자는 위험 상황에 직접 개입하지 않으며, 필요한 조치는 소유자가 판단합니다.'],
  ['예약하면 바로 결제되나요?', `아니요. 월 1회 외부 점검 ${priceLabel}원의 유료 시범 이용을 예약하는 단계입니다. 아직 서비스 개발과 운영 준비 중이며, 운영 시작 후 방문 가능 지역과 최종 조건을 확인하고 동의한 경우에만 별도로 결제합니다. 자동 결제나 자동 구독은 없습니다.`],
  ['첫 이용 쿠폰은 어떻게 사용하나요?', `월 ${priceLabel}원의 유료 이용 의향을 확인하고 사전 신청을 완료하면 첫 이용 ${discountLabel}원 할인 쿠폰이 자동 발급됩니다. 완료 화면에서 고유 코드를 확인해주세요. 기본 요금 기준 첫 결제는 ${firstPaymentLabel}원, 이후에는 월 ${priceLabel}원입니다. 예약 접수일부터 ${PILOT_OFFER.couponValidityDays}일 동안, 점검 가능한 지역에서 첫 결제에 한 번 사용하며 다른 할인과 중복되지 않습니다. 운영팀의 이용 안내에 쿠폰 코드를 알려주세요. 쿠폰 발급은 실제 결제가 아닙니다.`],
]

export default function Home() {
  const router = useRouter()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [report, setReport] = useState(0)
  useEffect(() => { track('landing_view') }, [])
  function openSurvey(placement: string) {
    track('survey_entry_click', placement)
    const query = new URLSearchParams()
    const incoming = new URLSearchParams(window.location.search)
    for (const key of ['utm_source', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_term']) {
      const value = incoming.get(key)
      if (value) query.set(key, value)
    }
    router.push('/survey' + (query.size ? '?' + query.toString() : ''))
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
          <div className="nav-actions"><button className="button button-small" onClick={() => openSurvey('header')}>설문조사 참여하기 <ArrowUpRight size={16} /></button><button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="메뉴 열기" aria-expanded={mobileMenu}>{mobileMenu ? <X /> : <Menu />}</button></div>
        </div>
      </header>
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow pill"><span className="status-dot" /> 현재 개발 중 · 사전 신청 접수</span>
            <h1>멀리 있는 우리 집,<br /><span>어떻게 관리하고 계신가요?</span></h1>
            <p className="hero-description">상속받은 시골집, 빈집, 주말주택.<br />현재 관리 방법과 최근에 관리를 미룬 경험을 들려주세요.<br />여러분의 실제 경험을 바탕으로 집온을 준비하고 있습니다.</p>
            <div className="hero-buttons"><button className="button" onClick={() => openSurvey('hero')}>설문조사 참여하기 <ArrowUpRight size={19} /></button><a className="text-link" href="#report" onClick={() => track('report_view', 'hero')}>어떤 리포트를 받나요? <ArrowRight size={17} /></a></div>
            <p className="hero-note"><Check size={15} /> 최대 4개 질문 <span>·</span> 약 1분 <span>·</span> 설문에 연락처 입력 없음</p>
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

        <section className="section container how-section"><div className="section-heading centered"><span className="eyebrow">HOW IT WORKS</span><h2>사전 신청부터 출시 후 점검까지.</h2><p>출시 후, 우리 집에 필요한 확인부터 함께 정합니다.</p></div><div className="steps">{[{ icon: MapPin, title: '지역과 주택 정보 남기기', text: '관리 중인 주택의 시·군과\n필요한 점검 주기를 알려주세요.' }, { icon: CalendarDays, title: '가능 지역 · 방문 범위 확인', text: '점검자를 연결할 수 있는지 확인하고,\n방문 범위와 최종 요금을 합의합니다.' }, { icon: Camera, title: '방문 후 리포트 받기', text: '합의한 외부 구역을 방문하고,\n사진과 관찰 결과를 전달합니다.' }].map((item, index) => <article key={item.title}><div className="step-icon"><item.icon size={26} /><span>0{index + 1}</span></div><h3>{item.title}</h3><p>{item.text}</p>{index < 2 && <ArrowRight className="step-arrow" size={23} />}</article>)}</div><div className="scope-note"><ShieldCheck size={20} /><p>초기에는 <strong>실내 출입과 열쇠 보관 없이, 승인된 외부 구역만</strong> 확인해요.<br className="mobile-break" /> 실시간 감시 · 긴급 출동 · 청소 · 수리는 포함되지 않습니다.</p></div></section>

        <section className="pricing-section" id="pricing"><div className="container pricing-layout"><div><span className="eyebrow">A SMALL VISIT, A LITTLE PEACE</span><h2>한 달에 한 번,<br />우리 집 안부를 받아보세요.</h2><p>먼 길을 떠나기 전, 집의 상태부터 확인할 수 있도록.<br />현재 서비스를 개발하고 있습니다.<br />사전 신청 시 첫 이용 {discountLabel}원 할인 쿠폰을 드립니다.</p><span className="pilot-tag"><span className="status-dot" /> 현재 개발 중 · 사전 신청 모집</span></div><div className="price-card"><div className="price-top"><span>외부 점검 시범 서비스</span><span>출시 예정 요금</span></div><div className="price">{priceLabel}<span>원 / 월</span></div><p className="price-caption">월 1회 외부 점검 기준 · 서비스 개발 중</p><ul><li><Check /> 대문·현관, 창문·외벽, 마당·진입로 확인</li><li><Check /> 사전 합의한 위치의 사진과 관찰 결과</li><li><Check /> 방문 기록과 항목별 상태 리포트</li></ul><button className="button" onClick={() => openSurvey('pricing')}>설문조사 참여하기 <ArrowUpRight size={18} /></button><p className="price-disclaimer">지금 결제되지 않습니다. 운영 시작 후 최종 조건을 확인하고<br />동의한 경우에만 결제합니다. 자동 결제는 없습니다.</p></div></div></section>

        <section className="section container faq-section" id="faq"><div className="section-heading"><span className="eyebrow">GOOD TO KNOW</span><h2>예약 전에 궁금한 것들.</h2><p>처음 맡기는 일이니까, 충분히 알고 결정하세요.</p></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={19} /></summary><p>{answer}</p></details>)}</div></section>
        <section className="final-cta container"><div className="cta-house"><House size={35} strokeWidth={1.5} /></div><span className="eyebrow">멀리 있어도, 마음은 그 집에.</span><h2>다음 확인은, 집온과 함께.</h2><p>현재 개발 중인 집온에 사전 신청하고, 첫 이용 {discountLabel}원 할인 쿠폰을 받아두세요.</p><button className="button" onClick={() => openSurvey('bottom')}>설문조사 참여하기 <ArrowUpRight size={18} /></button><span className="final-note">약 2분 소요 · 출시 후 조건 확인·결제</span></section>
      </main>
      <footer className="footer container"><a className="logo" href="#"><House size={23} /><span>집온<span className="logo-dot">.</span></span></a><p>집의 안부를 전하는, 가까운 연결.</p><span>© {new Date().getFullYear()} 집온 · 서비스 개발 중</span></footer>
      <div className="mobile-cta"><div><strong>월 1회 {priceLabel}원</strong><span>개발 중 · 신청 시 1,000원 쿠폰</span></div><button className="button button-small" onClick={() => openSurvey('mobile_sticky')}>설문조사 참여하기 <ArrowUpRight size={16} /></button></div>


    </>
  )
}
