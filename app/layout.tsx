import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FitView - 맞춤형 면접 역량 강화 서비스',
  description: 'AI로 반복 연습하고, 필요할 때 전문가로 마무리하는 면접 준비의 새로운 표준. 취준생과 이직 준비 직장인을 위한 AI 면접 코칭 플랫폼.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${geist.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
