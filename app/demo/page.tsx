"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  X, 
  Check, 
  ImagePlus,
  Sparkles,
  Eye
} from "lucide-react"

const PLATFORMS = [
  { id: "daangn", name: "당근마켓", color: "bg-orange-500", textColor: "text-orange-600", bgLight: "bg-orange-50", borderColor: "border-orange-200" },
  { id: "bunjang", name: "번개장터", color: "bg-red-500", textColor: "text-red-600", bgLight: "bg-red-50", borderColor: "border-red-200" },
  { id: "joonggonara", name: "중고나라", color: "bg-green-600", textColor: "text-green-600", bgLight: "bg-green-50", borderColor: "border-green-200" },
  { id: "secondwear", name: "세컨웨어", color: "bg-indigo-500", textColor: "text-indigo-600", bgLight: "bg-indigo-50", borderColor: "border-indigo-200" },
  { id: "hellomarket", name: "헬로마켓", color: "bg-sky-500", textColor: "text-sky-600", bgLight: "bg-sky-50", borderColor: "border-sky-200" },
]

const CATEGORIES = [
  "디지털기기", "가구/인테리어", "유아동", "여성의류", "남성의류", 
  "생활/가공식품", "스포츠/레저", "취미/게임", "뷰티/미용", "반려동물용품",
  "도서/티켓/음반", "식물", "기타 중고물품"
]

export default function DemoPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Form data
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    const newImages: string[] = []
    Array.from(files).slice(0, 10 - images.length).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string)
          if (newImages.length === Math.min(files.length, 10 - images.length)) {
            setImages(prev => [...prev, ...newImages])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const selectAllPlatforms = () => {
    setSelectedPlatforms(PLATFORMS.map(p => p.id))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setShowSuccess(true)
  }

  const canProceedStep1 = title && price && description && category && images.length > 0
  const canProceedStep2 = selectedPlatforms.length > 0

  // Success screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-chart-5 to-accent flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl shadow-2xl p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            등록 완료!
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            <span className="font-semibold text-foreground">{selectedPlatforms.length}개</span> 플랫폼에 동시 등록이 완료되었습니다.
            <br />실제 서비스에서는 이렇게 한 번에 등록됩니다!
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {selectedPlatforms.map(platformId => {
              const platform = PLATFORMS.find(p => p.id === platformId)
              return platform ? (
                <span key={platformId} className={`px-3 py-1.5 rounded-full text-sm font-medium ${platform.bgLight} ${platform.textColor}`}>
                  {platform.name}
                </span>
              ) : null
            })}
          </div>
          <p className="text-sm text-muted-foreground mb-6 p-4 bg-secondary rounded-xl">
            이 데모가 마음에 드셨다면, 실제 서비스 출시 알림을 받아보세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => {
                setShowSuccess(false)
                setStep(1)
                setTitle("")
                setPrice("")
                setDescription("")
                setCategory("")
                setImages([])
                setSelectedPlatforms([])
              }}
            >
              사용 안한다
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-chart-5 hover:opacity-90"
              onClick={() => router.push("/#waitlist")}
            >
              사용한다
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">돌아가기</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-5 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">올인원 데모</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-card border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? "bg-gradient-to-br from-primary to-chart-5 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                글 작성
              </span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? "bg-gradient-to-br from-primary to-chart-5 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {step > 2 ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                플랫폼 선택
              </span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 3 ? "bg-gradient-to-br from-primary to-chart-5 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ${step >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
                미리보기
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Step 1: Write Post */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                중고거래 글 작성하기
              </h1>
              <p className="text-muted-foreground">
                판매하고 싶은 물품의 정보를 입력해주세요
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6 sm:p-8 space-y-6">
              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  사진 ({images.length}/10)
                </label>
                <div className="flex flex-wrap gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-foreground/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-background" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          대표
                        </span>
                      )}
                    </div>
                  ))}
                  {images.length < 10 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-colors"
                    >
                      <ImagePlus className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">추가</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  제목
                </label>
                <Input
                  placeholder="예: 아이폰 14 프로 256GB 스페이스블랙"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  카테고리
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        category === cat 
                          ? "bg-gradient-to-r from-primary to-chart-5 text-primary-foreground shadow-md" 
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  가격
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="100,000"
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "")
                      setPrice(value ? Number(value).toLocaleString() : "")
                    }}
                    className="h-12 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    원
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  설명
                </label>
                <Textarea
                  placeholder="물품에 대한 상세 설명을 입력해주세요. 구매 시기, 사용 기간, 하자 여부 등을 포함하면 좋아요."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="gap-2 bg-gradient-to-r from-primary to-chart-5 hover:opacity-90 shadow-lg px-8 h-12"
              >
                다음: 플랫폼 선택
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Platforms */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                등록할 플랫폼 선택
              </h1>
              <p className="text-muted-foreground">
                동시에 등록하고 싶은 플랫폼을 선택해주세요
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedPlatforms.length}개 선택됨
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={selectAllPlatforms}
                  className="gap-1"
                >
                  <Check className="w-3 h-3" />
                  전체 선택
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {PLATFORMS.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`p-5 rounded-2xl border-2 transition-all text-left ${
                      selectedPlatforms.includes(platform.id)
                        ? `${platform.borderColor} ${platform.bgLight} shadow-md`
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 ${platform.color} rounded-xl flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">
                          {platform.name.charAt(0)}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlatforms.includes(platform.id)
                          ? `${platform.color} border-transparent`
                          : "border-muted"
                      }`}>
                        {selectedPlatforms.includes(platform.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      자동으로 최적화된 형식으로 등록됩니다
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="gap-2 h-12 px-6"
              >
                <ArrowLeft className="w-4 h-4" />
                이전
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="gap-2 bg-gradient-to-r from-primary to-chart-5 hover:opacity-90 shadow-lg px-8 h-12"
              >
                다음: 미리보기
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                등록 미리보기
              </h1>
              <p className="text-muted-foreground">
                각 플랫폼에 이렇게 등록됩니다
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {selectedPlatforms.map(platformId => {
                const platform = PLATFORMS.find(p => p.id === platformId)
                if (!platform) return null
                
                return (
                  <div key={platformId} className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                    <div className={`${platform.color} px-4 py-3 flex items-center gap-2`}>
                      <span className="text-white font-bold text-sm">
                        {platform.name.charAt(0)}
                      </span>
                      <span className="text-white font-semibold text-sm">{platform.name}</span>
                      <Eye className="w-4 h-4 text-white/70 ml-auto" />
                    </div>
                    <div className="p-4">
                      {/* Mock Post Preview */}
                      <div className="flex gap-3">
                        {images[0] && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                            <img src={images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{title}</h3>
                          <p className="text-lg font-bold text-foreground mt-1">
                            {price}원
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${platform.bgLight} ${platform.textColor}`}>
                              {category}
                            </span>
                            <span className="text-xs text-muted-foreground">방금 전</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-primary/5 via-card to-accent/5 rounded-2xl border border-primary/20 shadow-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-chart-5 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">등록 준비 완료!</h3>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{selectedPlatforms.length}개</span> 플랫폼에 동시에 등록됩니다.
                    버튼을 클릭하면 모든 플랫폼에 한 번에 글이 올라갑니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="gap-2 h-12 px-6"
              >
                <ArrowLeft className="w-4 h-4" />
                이전
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 bg-gradient-to-r from-primary to-chart-5 hover:opacity-90 shadow-lg px-8 h-12"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">
                      <Upload className="w-4 h-4" />
                    </span>
                    등록 중...
                  </>
                ) : (
                  <>
                    {selectedPlatforms.length}개 플랫폼에 등록하기
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
