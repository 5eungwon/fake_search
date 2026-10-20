import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, House } from 'lucide-react'
import InspectionDemo from '@/components/inspection-demo'

export const metadata: Metadata = {
  title: '점검 요청부터 결과까지 체험하기 | 집온',
  description: '집온의 점검 요청, 진행 상태, 위치별 사진 리포트를 직접 체험해보세요. 실제 방문이나 결제가 발생하지 않는 예시 화면입니다.',
}
export default function DemoPage() {
  return <div className="inspection-demo-page">
    <header className="site-header"><div className="container nav-row"><Link href="/" className="logo" aria-label="집온 홈"><House size={27} /><span>집온<span className="logo-dot">.</span></span></Link><Link href="/" className="text-link"><ArrowLeft size={17} /> 메인으로 돌아가기</Link></div></header>
    <main className="container"><InspectionDemo /></main>
    <footer className="container demo-footer">집온 · 서비스 개발 중 · 화면의 사진과 점검 결과는 예시입니다.</footer>
  </div>
}
