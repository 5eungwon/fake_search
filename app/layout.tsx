import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '집온 | 멀리 있는 우리 집, 가까운 이웃의 확인',
  description: '멀리 있는 시골집과 주말주택, 지역 주민이 합의한 외부 구역을 방문하고 사진과 점검 결과를 전달합니다. 월 1회 9,900원의 유료 시범 서비스를 예약하세요. 운영 시작 후 조건을 확인하고 결제합니다.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>
}
