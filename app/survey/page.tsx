import type { Metadata } from 'next'
import Link from 'next/link'
import { House, ArrowLeft } from 'lucide-react'
import SurveyExperience from '@/components/survey-experience'

export const metadata: Metadata = {
  title: '주택 관리 경험 설문 | 집온',
  description: '별도로 관리하는 주택의 관리 방법과 최근 관리 경험을 알려주세요. 최대 4개 질문, 약 1분. 설문 제출에는 연락처가 필요하지 않습니다.',
}
export default function SurveyPage() {
  return <div className="survey-page">
    <header className="site-header"><div className="container nav-row"><Link className="logo" href="/" aria-label="집온 메인 화면"><House size={27} strokeWidth={2.2} /><span>집온<span className="logo-dot">.</span></span></Link><Link className="text-link" href="/"><ArrowLeft size={17} /> 메인으로 돌아가기</Link></div></header>
    <main><SurveyExperience /></main>
    <footer className="container survey-page-footer">집온 · 서비스 개발 중 · 응답해주셔서 감사합니다.</footer>
  </div>
}
