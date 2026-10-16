'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Camera, ChevronRight, House, ShieldCheck } from 'lucide-react'
import { track } from '@/lib/client-tracking'

const sampleChecks = [
  { key: 'entrance', area: '대문 · 현관', status: '특이사항 없음', tone: 'good', detail: '대문은 닫혀 있으며, 현관 주변에 눈에 띄는 변화가 없습니다.', image: '/images/report-entrance.webp', alt: '닫힌 현관문과 주변 상태를 가까이서 촬영한 예시 이미지' },
  { key: 'yard', area: '마당 · 진입로', status: '이상 발견', tone: 'warning', detail: '진입로에 떨어진 나뭇가지를 발견했습니다.', image: '/images/report-yard.webp', alt: '주택으로 이어지는 진입로에 나뭇가지가 떨어져 있는 예시 이미지' },
  { key: 'window', area: '뒷면 창문', status: '확인 불가', tone: 'neutral', detail: '울타리와 수풀에 가려 허용된 이동 구역에서는 창문 상태를 확인하지 못했습니다.', image: '/images/report-window-blocked.webp', alt: '울타리와 수풀에 가려 뒷면 창문을 확인할 수 없는 접근 구역의 예시 이미지' },
]

export default function SurveyReportPreview() {
  const [selected, setSelected] = useState(0)
  const id = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const active = sampleChecks[selected]
  function select(index: number) {
    setSelected(index)
    track('report_view', `survey_report_${sampleChecks[index].key}`)
  }
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % sampleChecks.length
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + sampleChecks.length - 1) % sampleChecks.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = sampleChecks.length - 1
    else return
    event.preventDefault(); select(next); buttons.current[next]?.focus()
  }
  return <figure className="survey-report-preview" aria-labelledby={`${id}-caption`}>
    <div className="survey-report-heading"><span><House size={17} /> 집온 점검 리포트</span><span className="sample-badge">SAMPLE</span></div>
    <div className="survey-report-intro"><strong>이런 리포트를 받아보세요</strong><span>아래 항목을 누르면 해당 위치의 사진을 볼 수 있어요.</span></div>
    <div role="tabpanel" id={`${id}-photo`} aria-labelledby={`${id}-tab-${selected}`} className="survey-report-photo-panel">
      <div className="survey-report-image"><img src={active.image} alt={active.alt} width={1200} height={800} /><span><Camera size={13} /> {active.area} 촬영 예시</span></div>
      <div className="survey-report-selected" aria-live="polite"><div><strong>{active.area}</strong><span className={`result-status ${active.tone}`}>{active.status}</span></div><p>{active.detail}</p></div>
    </div>
    <div className="survey-report-checks" role="tablist" aria-label="위치별 점검 사진" aria-orientation="vertical">{sampleChecks.map((item, index) => <button type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={selected === index} aria-controls={`${id}-photo`} tabIndex={selected === index ? 0 : -1} ref={element => { buttons.current[index] = element }} className={`survey-report-check${selected === index ? ' is-selected' : ''}`} key={item.key} onClick={() => select(index)} onKeyDown={event => navigate(event, index)}><span className="survey-report-check-label"><strong>{item.area}</strong><span className={`result-status ${item.tone}`}>{item.status}</span></span><ChevronRight size={15} aria-hidden="true" /></button>)}</div>
    <figcaption id={`${id}-caption`}><ShieldCheck size={15} /><span>사진은 AI로 제작한 위치별 예시 이미지이며,<br />실제 고객의 주택이나 점검 결과가 아닙니다.</span></figcaption>
  </figure>
}
