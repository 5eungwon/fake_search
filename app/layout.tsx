import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '집온 | 멀리 있는 우리 집, 가까운 이웃의 확인',
  description: '멀리 있는 시골집과 주말주택, 지역 주민이 합의한 외부 구역을 방문하고 사진과 점검 결과를 전달합니다. 현재 개발 중인 회당 9,900원 외부 점검 서비스. 사전 신청 시 첫 이용 1,000원 할인 쿠폰을 드립니다. 출시 후 조건 확인 및 결제.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>
}
