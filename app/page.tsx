'use client'

import { useEffect } from 'react'
import Link from 'next/link'

const BLUE = '#2756EF'

function trackCouponClick() {
  fetch('/api/track?event=coupon_click').catch(() => {})
}

export default function LandingPage() {
  useEffect(() => {
    fetch('/api/track?event=visit').catch(() => {})
  }, [])

  return (
    <div style={{ fontFamily: 'Geist, system-ui, sans-serif', color: '#1a1a2e' }}>
      {/* NAV */}
      <nav style={{ backgroundColor: BLUE, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px' }}>FitView</span>
          <Link href="/coupon" onClick={trackCouponClick}>
            <button style={{ backgroundColor: '#fff', color: BLUE, fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
              얼리버드 쿠폰 받기
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ backgroundColor: BLUE, padding: '80px 24px 96px', textAlign: 'center' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '6px 16px', borderRadius: 999, marginBottom: 24 }}>
            맞춤형 면접 역량 강화 서비스
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 24, letterSpacing: '-1px' }}>
            AI로 반복 연습하고,<br />필요할 때 전문가로 마무리
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            기업·직무 맞춤 AI 면접 + 현직자 전문가 매칭.<br />
            학원 대비 1/10 가격으로 실전 역량을 완성하세요.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/coupon" onClick={trackCouponClick}>
              <button style={{ backgroundColor: '#fff', color: BLUE, fontWeight: 800, fontSize: 16, padding: '16px 36px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                얼리버드 쿠폰 받기 →
              </button>
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 64, flexWrap: 'wrap' }}>
            {[
              { num: '92.1%', label: '면접 중심 채용' },
              { num: '71.9%', label: '취준생이 가장 어려운 단계로 인식' },
              { num: '455만원', label: '연간 평균 취업 준비 비용' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 28 }}>{s.num}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ backgroundColor: '#f8f9ff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ color: BLUE, fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>문제 정의</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, marginTop: 12, letterSpacing: '-0.5px' }}>
              기존 면접 준비 방식의 한계
            </h2>
            <p style={{ color: '#666', fontSize: 17, marginTop: 12 }}>어떤 방법으로 준비해도 하나씩 빠지는 것이 있습니다</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { title: '혼자 연습', good: '시간·공간 제약 없음', bad: '피드백 부족\n긴장감·현장감 부족\n기업 맞춤 서비스 없음' },
              { title: '스터디', good: '다양한 관점, 동기부여', bad: '구성원 역량 차이\n피드백 품질 편차 발생' },
              { title: '전문가 컨설팅', good: '전문적이고 정확한 피드백', bad: '1회 10~30만원\n주기적 활용 불가능' },
              { title: 'AI 면접 서비스', good: '즉각 피드백, 데이터 기반', bad: '깊이 있는 분석 불가\n대인 면접과의 괴리' },
            ].map((item) => (
              <div key={item.title} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, border: '1px solid #eee', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>{item.title}</h3>
                <div style={{ marginBottom: 14 }}>
                  <span style={{ backgroundColor: '#EEF3FF', color: BLUE, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 4 }}>장점</span>
                  <p style={{ color: '#444', fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>{item.good}</p>
                </div>
                <div>
                  <span style={{ backgroundColor: '#FFF0F0', color: '#E53E3E', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 4 }}>단점</span>
                  <p style={{ color: '#E53E3E', fontSize: 14, marginTop: 8, lineHeight: 1.6, fontWeight: 600, whiteSpace: 'pre-line' }}>{item.bad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section style={{ backgroundColor: BLUE, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>솔루션</span>
            <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, marginTop: 12 }}>
              면접 준비의 새로운 표준
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginTop: 12 }}>AI로 반복하고, 전문가로 마무리하고, 공간으로 완성하세요</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                icon: '🤖',
                title: 'AI 기반 면접 연습',
                subtitle: '상시 연습할 수 있는 환경',
                items: ['기업·직무 맞춤 질문 생성', '시공간 제약 없는 면접 환경', '논리 구조·답변 전략 딥 피드백'],
              },
              {
                icon: '👤',
                title: '선택적 전문가 매칭',
                subtitle: '사용자의 부족한 능력에 맞는 전문가',
                items: ['AI 진단 기반 현직자 매칭', '실전 감각과 업계 시각 반영', '압박 대응 심화 피드백'],
              },
              {
                icon: '🏢',
                title: '오프라인 공간 대여',
                subtitle: '대면 모의 면접을 위한 공간',
                items: ['스터디카페·회의실 연결', '실제 면접 환경 재현', '대면 희망자 전용 옵션'],
              },
            ].map((s) => (
              <div key={s.title} style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 32, border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginBottom: 20 }}>{s.subtitle}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {s.items.map((it) => (
                    <li key={it} style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: '#fff', fontWeight: 700, flexShrink: 0 }}>✓</span> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ backgroundColor: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ color: BLUE, fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>경쟁우위</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, marginTop: 12 }}>기존 서비스 vs FitView</h2>
          </div>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '20px 24px', backgroundColor: '#f3f4f6', textAlign: 'left', fontWeight: 700, fontSize: 15, color: '#666' }}>구분</th>
                  <th style={{ padding: '20px 24px', backgroundColor: '#f3f4f6', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#666' }}>기존 서비스</th>
                  <th style={{ padding: '20px 24px', backgroundColor: BLUE, textAlign: 'center', fontWeight: 800, fontSize: 15, color: '#fff' }}>FitView</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['피드백 품질', '구성원 역량 차이로 편차 큼', '선택적 전문가 매칭 시스템'],
                  ['현장감', '현장 재현성 부족', '공간 대여 서비스 제공'],
                  ['피드백 깊이', '표면적 조언에 그침', '온·오프라인 대면 모의 면접'],
                  ['비용', '1회 10~100만원, 반복 불가', 'AI 무제한 월 9,900원'],
                ].map(([label, before, after], i) => (
                  <tr key={label} style={{ borderTop: '1px solid #e5e7eb', backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '18px 24px', fontWeight: 600, fontSize: 15 }}>{label}</td>
                    <td style={{ padding: '18px 24px', textAlign: 'center', color: '#999', fontSize: 14 }}>{before}</td>
                    <td style={{ padding: '18px 24px', textAlign: 'center', color: BLUE, fontWeight: 700, fontSize: 14 }}>{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ backgroundColor: '#f8f9ff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ color: BLUE, fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>가격</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, marginTop: 12 }}>학원 대비 1/10~1/30 가격</h2>
            <p style={{ color: '#666', fontSize: 17, marginTop: 12 }}>반복 연습이 가능한 가격 구조</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, alignItems: 'start' }}>
            {[
              {
                tier: '무료 (Free)',
                price: '0원',
                sub: '영원히 무료',
                features: ['채용 공고 애그리게이터', 'AI 모의면접 3회/월', '기본 피드백 리포트'],
                highlight: false,
              },
              {
                tier: '프로 (Pro)',
                price: '월 9,900원',
                sub: '학원 대비 1/10~1/30',
                features: ['AI 모의면접 무제한', '기업·직무별 맞춤 시나리오', '음성 분석 리포트', '딥 피드백 (논리·압박 대응)'],
                highlight: true,
              },
              {
                tier: '멘토 매칭',
                price: '건당 5~10만원',
                sub: '컨설팅 대비 1/5~1/10',
                features: ['현직자 1:1 모의면접', 'AI 진단 기반 전문가 연결', '실전 감각·업계 시각 피드백', '플랫폼 수수료 20%만'],
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.tier}
                style={{
                  backgroundColor: plan.highlight ? BLUE : '#fff',
                  borderRadius: 20,
                  padding: 36,
                  border: plan.highlight ? 'none' : '1px solid #e5e7eb',
                  boxShadow: plan.highlight ? '0 8px 40px rgba(39,86,239,0.35)' : '0 2px 12px rgba(0,0,0,0.04)',
                  position: 'relative',
                }}
              >
                {plan.highlight && (
                  <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FFD700', color: '#000', fontWeight: 800, fontSize: 12, padding: '4px 16px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                    가장 인기
                  </span>
                )}
                <h3 style={{ color: plan.highlight ? '#fff' : '#1a1a2e', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{plan.tier}</h3>
                <div style={{ color: plan.highlight ? '#fff' : BLUE, fontWeight: 900, fontSize: 30, marginBottom: 4 }}>{plan.price}</div>
                <div style={{ color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#999', fontSize: 13, marginBottom: 28 }}>{plan.sub}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ color: plan.highlight ? 'rgba(255,255,255,0.9)' : '#444', fontSize: 14, padding: '7px 0', borderBottom: `1px solid ${plan.highlight ? 'rgba(255,255,255,0.15)' : '#f0f0f0'}`, display: 'flex', gap: 10 }}>
                      <span style={{ color: plan.highlight ? '#fff' : BLUE, fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/coupon" onClick={trackCouponClick}>
                  <button style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 10,
                    border: plan.highlight ? '2px solid #fff' : `2px solid ${BLUE}`,
                    backgroundColor: plan.highlight ? '#fff' : 'transparent',
                    color: BLUE,
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: 'pointer',
                  }}>
                    쿠폰 받기
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ backgroundColor: BLUE, padding: '96px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}>
            얼리버드 쿠폰으로<br />지금 시작하세요
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}>
            Pro 구독 3개월 무료 + 이후 50% 할인<br />
            첫 전문가 매칭 20% 할인 쿠폰을 지금 바로 받으세요.
          </p>
          <Link href="/coupon" onClick={trackCouponClick}>
            <button style={{
              backgroundColor: '#fff',
              color: BLUE,
              fontWeight: 800,
              fontSize: 18,
              padding: '18px 48px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}>
              무료 쿠폰 받기 →
            </button>
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 20 }}>
            쿠폰 발급 후 서비스 출시 시 즉시 적용됩니다
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0f1523', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: 12 }}>FitView</div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>맞춤형 면접 역량 강화 서비스 · KHUGLE 팀</p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 16 }}>© 2026 FitView. All rights reserved.</p>
      </footer>
    </div>
  )
}
