"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Upload, ArrowLeft, Mail, Bell, Gift, Sparkles, PartyPopper } from "lucide-react"
import { Suspense } from "react"

function ThankYouContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-chart-5 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Upload className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">올인원</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-chart-3/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-lg w-full text-center relative">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-chart-2/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-accent to-chart-2 rounded-full flex items-center justify-center shadow-xl shadow-accent/30">
                <CheckCircle2 className="w-12 h-12 text-accent-foreground" />
              </div>
              <div className="absolute -top-2 -right-2">
                <PartyPopper className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              감사합니다!
            </h1>
            <p className="text-muted-foreground text-lg">
              수요조사에 참여해주셔서 진심으로 감사드립니다.
            </p>
          </div>

          {/* Email Confirmation */}
          {email && (
            <div className="bg-gradient-to-br from-card to-secondary/30 border border-border/50 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">등록된 이메일</span>
              </div>
              <p className="font-semibold text-foreground text-lg">{email}</p>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-card rounded-2xl p-8 mb-8 text-left border border-border/50 shadow-lg">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground text-lg">
                앞으로 이런 소식을 전해드릴게요
              </h2>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-chart-5 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <Bell className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">출시 알림</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    서비스가 준비되면 가장 먼저 알려드립니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-chart-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
                  <Gift className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">얼리버드 혜택</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    사전 등록자에게만 드리는 특별한 혜택을 준비하고 있어요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <Link href="/">
            <Button variant="outline" className="gap-2 h-12 px-8 text-base border-2 hover:bg-secondary">
              <ArrowLeft className="w-4 h-4" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-card">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-5 rounded-lg flex items-center justify-center shadow-md">
              <Upload className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">올인원</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2026 올인원. 수요조사를 위한 랜딩페이지입니다.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
