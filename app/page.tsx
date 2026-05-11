'use client'

import { useEffect } from 'react'
import Link from 'next/link'

const BLUE = '#2756EF'

export default function LandingPage() {
  useEffect(() => {
    fetch('/api/track?event=visit').catch(() => {})
  }, [])

  return (
    <div style={{ fontFamily: 'Geist, system-ui, sans-serif', color: '#1a1a2e', position: 'relative', overflow: 'hidden' }}>
      {/* BACKGROUND BLUR BLOBS */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(39,86,239,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,149,255,0.15) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', top: '60%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(39,86,239,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '15%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,160,255,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
      {/* NAV */}
      <nav style={{ backgroundColor: BLUE, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px' }}>FitView</span>
          <Link href="/coupon">
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
            은퇴 전문가 1:1 면접 컨설팅 서비스
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 24, letterSpacing: '-1px' }}>
            면접 준비, 이제는<br />경험 많은 전문가와 함께
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            수십 년 현장 경험을 가진 은퇴 전문가와의 1:1 모의면접.<br />
            학원 대비 1/5 가격으로, 촉박한 일정에도 유연하게.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/coupon">
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
              FitView가 제시하는 답
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginTop: 12 }}>검증된 전문가의 경험, 합리적인 가격, 유연한 일정으로 완성하세요</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                icon: '💼',
                title: '은퇴 전문가 1:1 매칭',
                subtitle: '수십 년 경험이 만드는 진짜 피드백',
                items: ['면접관·HR 출신 은퇴 전문가 직접 연결', '업계 맞춤 심층 피드백 제공', '학원 대비 1/5~1/10 합리적인 가격'],
              },
              {
                icon: '📅',
                title: '유연한 일정 매칭',
                subtitle: '촉박한 일정에도 걱정 없이',
                items: ['은퇴 전문가의 풍부한 시간적 여유', '면접 전날도 즉시 예약 가능', '현직자 대비 월등한 스케줄 유연성'],
              },
              {
                icon: '🏢',
                title: '온·오프라인 선택',
                subtitle: '원하는 방식으로 준비하세요',
                items: ['Zoom 화상 모의면접 기본 제공', '오프라인 공간 대여 옵션', '실제 면접장 현장감 재현'],
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

      {/* STORY */}
      <section style={{ backgroundColor: '#fff', padding: '72px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: BLUE, fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>기획 배경</span>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, marginTop: 12, letterSpacing: '-0.5px' }}>
            아직 초기 창업팀이지만,<br />진짜 문제를 해결하고 싶습니다
          </h2>
          <p style={{ color: '#555', fontSize: 16, lineHeight: 1.9, marginTop: 24 }}>
            취업 준비를 하면서 느꼈습니다. 전문가의 피드백을 받고 싶어도 1회 비용이 너무 높고,
            스터디에 의존하다 보면 피드백 품질이 들쭉날쭉합니다.
            <br /><br />
            FitView는 현직에서 은퇴한 면접관, HR 담당자, 현장 전문가들과 취준생을 연결하는 플랫폼입니다.
            전문가는 은퇴 후에도 경험을 나누고, 취준생은 합리적인 가격에 양질의 피드백을 받을 수 있습니다.
            <br /><br />
            <strong>2026년 하반기 출시를 목표로 준비 중입니다.</strong> 지금 얼리버드 쿠폰을 받으시면
            출시 즉시 적용되는 특별 혜택을 드립니다.
          </p>
          <div style={{ display: 'inline-block', backgroundColor: '#f0f4ff', borderRadius: 12, padding: '14px 28px', marginTop: 32, border: '1px solid #d0d8ff' }}>
            <span style={{ color: BLUE, fontWeight: 700, fontSize: 14 }}>KHUGLE 팀 · 2026년 하반기 출시 예정</span>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ backgroundColor: '#f8f9ff', padding: '80px 24px' }}>
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
                  ['피드백 품질', '역량 편차로 품질 들쭉날쭉', '검증된 은퇴 전문가 1:1 피드백'],
                  ['일정 유연성', '현직자로 일정 조율 어려움', '촉박한 일정에도 유연한 매칭'],
                  ['면접 현장감', '온라인으로만 진행', '오프라인 대면 면접 옵션 제공'],
                  ['비용', '1회 10~30만원, 반복 부담', '1회 3~6만원, 학원 대비 1/5'],
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
      <section style={{ backgroundColor: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ color: BLUE, fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>얼리버드 쿠폰</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, marginTop: 12 }}>지금 바로 쿠폰을 받으세요</h2>
            <p style={{ color: '#666', fontSize: 17, marginTop: 12 }}>서비스 출시 전 얼리버드 전용 할인 혜택</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>

            {/* 쿠폰 1 */}
            <div style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(39,86,239,0.15)', border: '2px solid #e5e9ff' }}>
              <div style={{ backgroundColor: BLUE, padding: '28px 28px 24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: 0.5 }}>쿠폰 #1</span>
                    <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginTop: 10, lineHeight: 1.2 }}>첫 세션<br />얼리버드 쿠폰</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textDecoration: 'line-through' }}>정가</div>
                    <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 32, lineHeight: 1 }}>50%</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>할인</div>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 20, backgroundColor: '#fff' }}>
                  <div style={{ position: 'absolute', top: -10, left: 20, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff' }} />
                  <div style={{ position: 'absolute', top: -10, right: 20, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff' }} />
                  <div style={{ borderTop: '2px dashed #c7d2fe', margin: '10px 40px 0' }} />
                </div>
              </div>
              <div style={{ padding: '28px 28px 24px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {[
                    '첫 컨설팅 세션 50% 할인',
                    '은퇴 전문가 1:1 모의면접 (60분)',
                    '심층 피드백 리포트 제공',
                    '후속 질문 Q&A 포함',
                    '서비스 출시 후 즉시 적용',
                  ].map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0', fontSize: 14, color: '#333', borderBottom: '1px solid #f5f5f5' }}>
                      <span style={{ color: BLUE, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/coupon">
                  <button style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', backgroundColor: BLUE, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(39,86,239,0.4)' }}>
                    쿠폰 받기
                  </button>
                </Link>
              </div>
            </div>

            {/* 쿠폰 2 */}
            <div style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(39,86,239,0.15)', border: '2px solid #e5e9ff' }}>
              <div style={{ backgroundColor: '#1E45D4', padding: '28px 28px 24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: 0.5 }}>쿠폰 #2</span>
                    <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginTop: 10, lineHeight: 1.2 }}>패키지<br />할인 쿠폰</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>최대</div>
                    <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 32, lineHeight: 1 }}>20%</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>추가 할인</div>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 20, backgroundColor: '#fff' }}>
                  <div style={{ position: 'absolute', top: -10, left: 20, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff' }} />
                  <div style={{ position: 'absolute', top: -10, right: 20, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff' }} />
                  <div style={{ borderTop: '2px dashed #c7d2fe', margin: '10px 40px 0' }} />
                </div>
              </div>
              <div style={{ padding: '28px 28px 24px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {[
                    '3회 패키지 구매 시 20% 추가 할인',
                    '은퇴 전문가 1:1 모의면접 3회',
                    '압박·심층 질문 특화 훈련',
                    '2회차부터 10% 할인 자동 적용',
                    '오프라인 대면 면접 옵션 선택 가능',
                  ].map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0', fontSize: 14, color: '#333', borderBottom: '1px solid #f5f5f5' }}>
                      <span style={{ color: '#1E45D4', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/coupon">
                  <button style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', backgroundColor: '#1E45D4', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(30,69,212,0.4)' }}>
                    쿠폰 받기
                  </button>
                </Link>
              </div>
            </div>

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
            첫 컨설팅 세션 50% 할인 쿠폰을 지금 바로 받으세요.<br />
            서비스 출시 즉시 적용되며, 얼리버드 혜택은 선착순입니다.
          </p>
          <Link href="/coupon">
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
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>은퇴 전문가 1:1 면접 컨설팅 서비스 · KHUGLE 팀</p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 16 }}>© 2026 FitView. All rights reserved.</p>
      </footer>
      </div>
    </div>
  )
}
