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
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [coupon1Code, setCoupon1Code] = useState<string | null>(null)
  const [coupon2Code, setCoupon2Code] = useState<string | null>(null)
  const [copied1, setCopied1] = useState(false)
  const [copied2, setCopied2] = useState(false)

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setEmailError('이메일 주소를 입력해 주세요.')
      return
    }
    if (!emailRegex.test(email)) {
      setEmailError('올바른 이메일 형식을 입력해 주세요.')
      return
    }
    setEmailError('')
    setEmailSubmitted(true)
    fetch(`/api/track?event=email_submit&email=${encodeURIComponent(email)}`).catch(() => {})
  }

  const handleCoupon1 = () => {
    fetch(`/api/track?event=coupon1&email=${encodeURIComponent(email)}`).catch(() => {})
    setCoupon1Code(generateCode('FV-EXP'))
  }

  const handleCoupon2 = () => {
    fetch(`/api/track?event=coupon2&email=${encodeURIComponent(email)}`).catch(() => {})
    setCoupon2Code(generateCode('FV-PKG'))
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

      {!emailSubmitted ? (
        /* EMAIL INPUT */
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px', marginTop: -32 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 8px 40px rgba(39,86,239,0.15)', border: '2px solid #e5e9ff', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎁</div>
            <h2 style={{ fontWeight: 900, fontSize: 22, color: '#1a1a2e', marginBottom: 8 }}>쿠폰 발급하기</h2>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
              이메일 주소를 입력하시면<br />얼리버드 쿠폰을 바로 발급해 드립니다.
            </p>
            <div style={{ marginBottom: 16, textAlign: 'left' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleEmailSubmit() }}
                placeholder="이메일 주소를 입력하세요"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: emailError ? '2px solid #E53E3E' : '2px solid #d0d8ff',
                  fontSize: 15,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  color: '#1a1a2e',
                }}
              />
              {emailError && (
                <p style={{ color: '#E53E3E', fontSize: 13, marginTop: 8 }}>{emailError}</p>
              )}
            </div>
            <button
              onClick={handleEmailSubmit}
              style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', backgroundColor: BLUE, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 16px rgba(39,86,239,0.4)' }}
            >
              쿠폰 받기 →
            </button>
            <p style={{ color: '#aaa', fontSize: 12, marginTop: 16, lineHeight: 1.5 }}>
              입력하신 이메일로 서비스 출시 소식도 알려드립니다.<br />
              스팸 발송 없이 출시 알림 1회만 발송됩니다.
            </p>
          </div>
        </div>
      ) : (
        /* COUPON CARDS */
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', marginTop: -32 }}>
          {/* Email confirmed banner */}
          <div style={{ backgroundColor: '#e8f5e9', borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', border: '1px solid #c8e6c9' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>✅</span>
            <p style={{ color: '#2e7d32', fontWeight: 600, fontSize: 14, margin: 0 }}>
              <strong>{email}</strong> 으로 등록되었습니다. 아래에서 원하는 쿠폰을 발급받으세요.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>

            {/* COUPON 1 - 첫 세션 할인 */}
            <div style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(39,86,239,0.15)', border: '2px solid #e5e9ff' }}>
              <div style={{ backgroundColor: BLUE, padding: '28px 28px 24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: 0.5 }}>쿠폰 #1</span>
                    <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginTop: 10, lineHeight: 1.2 }}>첫 세션<br />얼리버드 쿠폰</h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textDecoration: 'line-through' }}>정가</div>
                    <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 32, lineHeight: 1 }}>50%</div>
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

                {!coupon1Code ? (
                  <button
                    onClick={handleCoupon1}
                    style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', backgroundColor: BLUE, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 16px rgba(39,86,239,0.4)' }}
                  >
                    첫 세션 쿠폰 발급하기
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

            {/* COUPON 2 - 패키지 할인 */}
            <div style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(39,86,239,0.15)', border: '2px solid #e5e9ff' }}>
              <div style={{ backgroundColor: '#1E45D4', padding: '28px 28px 24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: 0.5 }}>쿠폰 #2</span>
                    <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginTop: 10, lineHeight: 1.2 }}>패키지<br />할인 쿠폰</h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>최대</div>
                    <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 32, lineHeight: 1 }}>20%</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>추가 할인</div>
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

                {!coupon2Code ? (
                  <button
                    onClick={handleCoupon2}
                    style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', backgroundColor: '#1E45D4', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 16px rgba(30,69,212,0.4)' }}
                  >
                    패키지 할인 쿠폰 발급하기
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
      )}
    </div>
  )
}
