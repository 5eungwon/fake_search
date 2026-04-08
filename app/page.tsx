"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle2, Clock, Smartphone, Upload, Zap, Sparkles, TrendingUp, Shield } from "lucide-react"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
  const sendVisit = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enter`)
      localStorage.setItem('visited', 'true')
    } catch (e) {
      console.error(e)
    }
  }

  if (!localStorage.getItem('visited')) sendVisit()
}, [])

  const push_btn = async()=>{
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push`)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    await push_btn()
    setIsLoading(false)
    router.push(`/thank-you?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-chart-5 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Upload className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">올인원</span>
          </div>
          <a href="#waitlist">
            <Button size="sm" className="bg-gradient-to-r from-primary to-chart-5 hover:opacity-90 shadow-lg shadow-primary/20">
              사전 등록
            </Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-secondary/50 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-foreground px-5 py-2.5 rounded-full text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>현재 개발 중</span>
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
            중고거래 글,
            <br />
            <span className="bg-gradient-to-r from-primary via-chart-5 to-accent bg-clip-text text-transparent">한 번에 모든 플랫폼으로</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
            당근마켓, 번개장터, 중고나라. 하나의 폼으로 작성하면 모든 플랫폼에 자동으로 등록됩니다. 더 이상 같은 글을 여러 번 쓰지 마세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#waitlist">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-chart-5 hover:opacity-90 shadow-xl shadow-primary/25 text-base px-8">
                사전 등록하기
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <a href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 border-2">
                자세히 보기
              </Button>
            </a>
          </div>
        </div>

        {/* Platform Logos Mock */}
        <div className="max-w-3xl mx-auto mt-16 relative">
          <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
            {["당근마켓", "번개장터", "중고나라", "세컨웨어", "헬로마켓"].map((platform, i) => (
              <div
                key={platform}
                className="bg-card border border-border/50 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="font-semibold text-foreground text-sm sm:text-base">{platform}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm mt-6">지원 예정 플랫폼</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-card via-card to-secondary/30 rounded-3xl border border-border/50 shadow-xl p-8 sm:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent">3x</div>
                <div className="text-sm text-muted-foreground font-medium">판매 노출 증가</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent to-chart-2 bg-clip-text text-transparent">80%</div>
                <div className="text-sm text-muted-foreground font-medium">시간 절약</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-chart-3 to-chart-5 bg-clip-text text-transparent">5+</div>
                <div className="text-sm text-muted-foreground font-medium">지원 플랫폼</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">1분</div>
                <div className="text-sm text-muted-foreground font-medium">등록 완료</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block text-primary font-semibold text-sm mb-3 tracking-wide uppercase">Pain Points</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              이런 불편함, 겪어보셨나요?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              중고거래를 자주 하시는 분들이라면 공감하실 거예요
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-card p-8 rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-3 text-lg">반복되는 글 작성</h3>
              <p className="text-muted-foreground leading-relaxed">
                똑같은 내용을 플랫폼마다 새로 작성하느라 시간을 낭비하고 계시진 않나요?
              </p>
            </div>
            <div className="group bg-card p-8 rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-bold text-foreground mb-3 text-lg">앱 전환의 피로</h3>
              <p className="text-muted-foreground leading-relaxed">
                당근, 번장, 중고나라... 앱마다 로그인하고 글 쓰는 게 너무 번거롭지 않나요?
              </p>
            </div>
            <div className="group bg-card p-8 rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-chart-3/20 to-chart-3/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7 text-chart-3" />
              </div>
              <h3 className="font-bold text-foreground mb-3 text-lg">사진 업로드 지옥</h3>
              <p className="text-muted-foreground leading-relaxed">
                같은 사진을 여러 앱에 일일이 올리느라 지치셨다면, 이제 그만하셔도 됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-accent font-semibold text-sm mb-3 tracking-wide uppercase">Features</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              올인원이 해결해드립니다
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              한 번의 작성으로 모든 플랫폼에 동시 등록
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group bg-gradient-to-br from-primary/5 via-card to-card p-8 rounded-2xl border border-primary/20 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-chart-5 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">원클릭 멀티 등록</h3>
              <p className="text-muted-foreground leading-relaxed">
                제목, 가격, 설명, 사진을 한 번만 입력하면 당근마켓, 번개장터, 중고나라에 동시에 등록됩니다.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-accent/5 via-card to-card p-8 rounded-2xl border border-accent/20 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-chart-2 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">통합 관리 대시보드</h3>
              <p className="text-muted-foreground leading-relaxed">
                모든 플랫폼의 문의와 상태를 한 곳에서 확인하고 관리하세요. 어떤 플랫폼에서 연락이 왔는지 한눈에!
              </p>
            </div>
            <div className="group bg-gradient-to-br from-chart-3/5 via-card to-card p-8 rounded-2xl border border-chart-3/20 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-chart-3 to-chart-5 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-chart-3/20 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">스마트 이미지 처리</h3>
              <p className="text-muted-foreground leading-relaxed">
                각 플랫폼에 맞게 이미지 크기와 개수를 자동으로 최적화해드립니다. 업로드는 한 번이면 충분해요.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-chart-5/5 via-card to-card p-8 rounded-2xl border border-chart-5/20 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-chart-5 to-primary rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-chart-5/20 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">예약 등록</h3>
              <p className="text-muted-foreground leading-relaxed">
                가장 조회수가 높은 시간대에 자동으로 글이 올라가도록 예약하세요. 판매 확률이 높아집니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block text-chart-3 font-semibold text-sm mb-3 tracking-wide uppercase">How It Works</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              이렇게 간단합니다
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              단 3단계로 모든 플랫폼에 글을 등록하세요
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-chart-5 text-primary-foreground rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto shadow-xl shadow-primary/25 group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-y-1/2" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">글 작성</h3>
              <p className="text-muted-foreground">
                하나의 폼에 제목, 가격, 설명, 사진을 입력하세요.
              </p>
            </div>
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-chart-2 text-accent-foreground rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto shadow-xl shadow-accent/25 group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-accent/50 to-transparent -translate-y-1/2" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">플랫폼 선택</h3>
              <p className="text-muted-foreground">
                등록하고 싶은 플랫폼들을 선택하세요. 전체 선택도 가능합니다.
              </p>
            </div>
            <div className="text-center group">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-chart-3 to-chart-5 text-primary-foreground rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto shadow-xl shadow-chart-3/25 group-hover:scale-110 transition-transform">
                  3
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">등록 완료</h3>
              <p className="text-muted-foreground">
                버튼 한 번으로 모든 플랫폼에 동시 등록됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Waitlist Section */}
      <section id="waitlist" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-chart-5 to-accent" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            얼리버드 혜택 준비 중
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
            출시 알림을 받아보세요
          </h2>
          <p className="text-white/85 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            현재 열심히 개발 중입니다. 이메일을 남겨주시면 서비스가 출시되는 즉시 가장 먼저 알려드릴게요.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white text-foreground placeholder:text-muted-foreground border-0 h-12 text-base shadow-xl"
            />
            <Button
              type="submit"
              variant="secondary"
              className="shrink-0 h-12 px-8 text-base font-semibold shadow-xl bg-foreground text-background hover:bg-foreground/90"
              disabled={isLoading}
            >
              {isLoading ? "등록 중..." : "사전 등록"}
            </Button>
          </form>
          <p className="text-white/60 text-sm mt-6">
            스팸 메일은 보내지 않습니다. 언제든 구독 취소가 가능합니다.
          </p>
        </div>
      </section>

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
