'use client'

import { useState } from 'react'
import Link from 'next/link'

const BLUE = '#2756EF'

function generateCode(prefix: string) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = prefix + '-'
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  code += '-'
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export default function CouponPage() {
  const [coupon1Code, setCoupon1Code] = useState<string | null>(null)
  const [coupon2Code, setCoupon2Code] = useState<string | null>(null)
  const [copied1, setCopied1] = useState(false)
  const [copied2, setCopied2] = useState(false)

  const handleCoupon1 = () => {
    fetch('/api/track?event=coupon1').catch(() => {})
    setCoupon1Code(generateCode('FV-PRO'))
  }

  const handleCoupon2 = () => {
    fetch('/api/track?event=coupon2').catch(() => {})
    setCoupon2Code(generateCode('FV-MTR'))
  }

  const copy = (text: string, which: 1 | 2) => {
    navigator.clipboard.writeText(text).then(() => {
      if (which === 1) {
        setCopied1(true)
        setTimeout(() => setCopied1(false), 2000)
      } else {
        setCopied2(true)
        setTimeout(() => setCopied2(false), 2000)
      }
    })
  }

  return (
    <div style={{ fontFamily: 'Geist, system-ui, sans-serif', minHeight: '100vh', backgroundColor: '#f0f4ff' }}>
      {/* NAV */}
      <nav style={{ backgroundColor: BLUE }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px' }}>FitView</span>
          </Link>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, cursor: 'pointer' }}>← 서비스 소개로</span>
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ backgroundColor: BLUE, padding: '56px 24px 72px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '6px 16px', borderRadius: 999, marginBottom: 20 }}>
          얼리버드 전용 혜택
        </div>
        <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.5px' }}>
          얼리버드 할인 쿠폰
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, lineHeight: 1.6 }}>
          FitView 출시 전 지금 쿠폰을 발급받으세요.<br />
          서비스 오픈 즉시 자동 적용됩니다.
        </p>
      </div>

      {/* COUPON CARDS */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', marginTop: -32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>

          {/* COUPON 1 - Pro 구독 */}
          <div style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(39,86,239,0.15)', border: '2px solid #e5e9ff' }}>
            {/* Coupon header stripe */}
            <div style={{ backgroundColor: BLUE, padding: '28px 28px 24px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: 0.5 }}>쿠폰 #1</span>
                  <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginTop: 10, lineHeight: 1.2 }}>Pro 구독<br />할인 쿠폰</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textDecoration: 'line-through' }}>월 9,900원</div>
                  <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 32, lineHeight: 1 }}>무료</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>3개월</div>
                </div>
              </div>
              {/* Dashed divider */}
              <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 20, backgroundColor: '#f0f4ff', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                <div style={{ position: 'absolute', top: -10, left: 20, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#f0f4ff' }} />
                <div style={{ position: 'absolute', top: -10, right: 20, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#f0f4ff' }} />
                <div style={{ borderTop: '2px dashed #c7d2fe', margin: '10px 40px 0' }} />
              </div>
            </div>

            {/* Coupon body */}
            <div style={{ padding: '28px 28px 24px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                {[
                  '서비스 출시 후 Pro 플랜 3개월 무료',
                  '이후 6개월간 구독료 50% 할인',
                  'AI 모의면접 무제한',
                  '기업·직무별 맞춤 시나리오',
                  '음성 분석 리포트 제공',
                ].map((f) => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0', fontSize: 14, color: '#333', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ color: BLUE, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              {!coupon1Code ? (
                <button
                  onClick={handleCoupon1}
                  style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', backgroundColor: BLUE, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 16px rgba(39,86,239,0.4)' }}
                >
                  Pro 구독 쿠폰 발급하기
                </button>
              ) : (
                <div>
                  <div style={{ backgroundColor: '#EEF3FF', borderRadius: 10, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, border: `1px dashed ${BLUE}` }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 18, color: BLUE, letterSpacing: 1 }}>{coupon1Code}</span>
                    <button
                      onClick={() => copy(coupon1Code, 1)}
                      style={{ backgroundColor: copied1 ? '#22c55e' : BLUE, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                      {copied1 ? '복사됨 ✓' : '복사'}
                    </button>
                  </div>
                  <p style={{ color: '#22c55e', fontWeight: 700, fontSize: 14, textAlign: 'center', margin: 0 }}>
                    ✓ 쿠폰이 발급되었습니다! 서비스 출시 시 적용해 주세요.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* COUPON 2 - 전문가 매칭 */}
          <div style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(39,86,239,0.15)', border: '2px solid #e5e9ff' }}>
            <div style={{ backgroundColor: '#1E45D4', padding: '28px 28px 24px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: 0.5 }}>쿠폰 #2</span>
                  <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginTop: 10, lineHeight: 1.2 }}>전문가 매칭<br />할인 쿠폰</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>최대</div>
                  <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 32, lineHeight: 1 }}>20%</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>할인</div>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 20, backgroundColor: '#f0f4ff' }}>
                <div style={{ position: 'absolute', top: -10, left: 20, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#f0f4ff' }} />
                <div style={{ position: 'absolute', top: -10, right: 20, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#f0f4ff' }} />
                <div style={{ borderTop: '2px dashed #c7d2fe', margin: '10px 40px 0' }} />
              </div>
            </div>

            <div style={{ padding: '28px 28px 24px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                {[
                  '첫 번째 전문가 매칭 20% 할인',
                  '현직자 1:1 모의면접',
                  'AI 진단 기반 최적 전문가 매칭',
                  '실전 감각·업계 시각 피드백',
                  '2회차부터 10% 할인 자동 적용',
                ].map((f) => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0', fontSize: 14, color: '#333', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ color: '#1E45D4', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              {!coupon2Code ? (
                <button
                  onClick={handleCoupon2}
                  style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', backgroundColor: '#1E45D4', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 16px rgba(30,69,212,0.4)' }}
                >
                  매칭 할인 쿠폰 발급하기
                </button>
              ) : (
                <div>
                  <div style={{ backgroundColor: '#EEF3FF', borderRadius: 10, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, border: '1px dashed #1E45D4' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 18, color: '#1E45D4', letterSpacing: 1 }}>{coupon2Code}</span>
                    <button
                      onClick={() => copy(coupon2Code, 2)}
                      style={{ backgroundColor: copied2 ? '#22c55e' : '#1E45D4', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                      {copied2 ? '복사됨 ✓' : '복사'}
                    </button>
                  </div>
                  <p style={{ color: '#22c55e', fontWeight: 700, fontSize: 14, textAlign: 'center', margin: 0 }}>
                    ✓ 쿠폰이 발급되었습니다! 서비스 출시 시 적용해 주세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INFO BOX */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: '24px 28px', marginTop: 24, border: '1px solid #e5e9ff', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>ℹ️</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#1a1a2e' }}>쿠폰 사용 안내</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                '발급된 쿠폰 코드를 복사하여 보관하세요.',
                'FitView 서비스 출시 후 회원가입 시 쿠폰 코드를 입력하면 즉시 적용됩니다.',
                '쿠폰은 계정 1개당 1회 사용 가능합니다.',
                '얼리버드 혜택은 서비스 출시 후 선착순으로 적용됩니다.',
              ].map((t) => (
                <li key={t} style={{ color: '#666', fontSize: 14, padding: '3px 0', display: 'flex', gap: 8 }}>
                  <span style={{ color: BLUE, flexShrink: 0 }}>·</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BACK CTA */}
        <div style={{ textAlign: 'center', padding: '40px 0 60px' }}>
          <Link href="/">
            <button style={{ backgroundColor: 'transparent', color: BLUE, fontWeight: 700, fontSize: 15, padding: '12px 32px', borderRadius: 10, border: `2px solid ${BLUE}`, cursor: 'pointer' }}>
              ← 서비스 소개 더 보기
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
