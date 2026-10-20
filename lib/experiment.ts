import { Redis } from '@upstash/redis'
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises'
import path from 'node:path'
import { PILOT_OFFER, paidIntent } from './offer'
import type { SurveyResponse } from './survey'

export const eventNames = ['landing_view', 'apply_click', 'report_view', 'form_start', 'form_step_complete', 'survey_start', 'survey_offer_click', 'survey_entry_click', 'survey_view', 'demo_entry_click', 'demo_view', 'demo_request', 'demo_progress', 'demo_result'] as const
export type ExperimentEvent = { event: string; source: string; campaign: string; variant: string; placement?: string; timestamp: string }
export type Application = { id: string; requestId: string; createdAt: string; ownership?: string; houseType?: string; region: string; lastVisit?: string; purpose?: string; currentMethod?: string; frequency?: string; surveyId?: string; priceIntent: string; offeredPrice?: number; billingUnit?: 'per_visit' | 'monthly'; offerVersion?: string; priceConfirmed?: boolean; contact: string; consent: true; interviewConsent: boolean; source: string; campaign: string; variant: string }
export type Coupon = { code: string; applicationId: string; requestId: string; issuedAt: string; expiresAt: string; discount: number; offeredPrice: number; billingUnit?: 'per_visit' | 'monthly' }
type Store = { events: ExperimentEvent[]; applications: Application[]; coupons: Coupon[]; surveys: SurveyResponse[] }
const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim()
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null
const prefix = 'jibon:pmf:v1'
const directory = path.resolve(/* turbopackIgnore: true */ process.env.PMF_DATA_DIR || path.join(process.cwd(), '.data'))
const file = path.join(directory, 'experiment.json')
// Serialize development file writes so simultaneous requests cannot overwrite each other.
let queue: Promise<unknown> = Promise.resolve()
function locked<T>(task: () => Promise<T>): Promise<T> {
  const next = queue.then(task, task)
  queue = next.catch(() => {})
  return next
}
function assertLocalStorage() {
  if (Boolean(redisUrl) !== Boolean(redisToken)) throw new Error('STORAGE_NOT_CONFIGURED')
  if (process.env.NODE_ENV === 'production' && !process.env.PMF_DATA_DIR) throw new Error('STORAGE_NOT_CONFIGURED')
}
async function readLocal(): Promise<Store> {
  assertLocalStorage()
  try { const data = JSON.parse(await readFile(file, 'utf8')); return { ...data, surveys: (data.surveys || []).filter((s: SurveyResponse) => s.createdAt > cutoff()), coupons: (data.coupons || []).filter((c: Coupon) => c.expiresAt > new Date().toISOString()) } }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { events: [], applications: [], coupons: [], surveys: [] }; throw error }
}
async function writeLocal(store: Store) {
  await mkdir(directory, { recursive: true, mode: 0o700 })
  await writeFile(`${file}.tmp`, JSON.stringify(store), { mode: 0o600 })
  await rename(`${file}.tmp`, file)
}
const cutoff = () => new Date(Date.now() - 90 * 86400000).toISOString()
export async function saveEvent(event: ExperimentEvent) {
  if (redis) {
    const id = crypto.randomUUID()
    await redis.set(`${prefix}:event:${id}`, event, { ex: 90 * 86400 })
    await redis.zadd(`${prefix}:events`, { score: Date.now(), member: id })
    return
  }
  await locked(async () => { const store = await readLocal(); store.events = store.events.filter(e => e.timestamp > cutoff()); store.applications = store.applications.filter(a => a.createdAt > cutoff()); store.events.push(event); await writeLocal(store) })
}
export async function saveApplication(application: Application): Promise<Application> {
  if (redis) {
    const key = `${prefix}:application:${application.requestId}`
    const saved = await redis.set(key, application, { nx: true, ex: 90 * 86400 })
    // Index repair is idempotent and also runs on a retry after a partial write.
    const result = saved ? application : await redis.get<Application>(key)
    if (!result) throw new Error('SAVE_FAILED')
    await redis.zadd(`${prefix}:applications`, { score: new Date(result.createdAt).getTime(), member: application.requestId })
    return result
  }
  return locked(async () => {
    const store = await readLocal(); store.applications = store.applications.filter(a => a.createdAt > cutoff()); store.events = store.events.filter(e => e.timestamp > cutoff())
    const existing = store.applications.find(a => a.requestId === application.requestId)
    if (existing) return existing
    store.applications.push(application); await writeLocal(store); return application
  })
}
export async function readExperiment(): Promise<Store> {
  if (redis) {
    const min = Date.now() - 90 * 86400000
    await Promise.all([redis.zremrangebyscore(`${prefix}:events`, '-inf', min), redis.zremrangebyscore(`${prefix}:applications`, '-inf', min)])
    await redis.zremrangebyscore(`${prefix}:surveys`, '-inf', min)
    const [eventIds, applicationIds, surveyIds] = await Promise.all([redis.zrange<string[]>(`${prefix}:events`, 0, -1), redis.zrange<string[]>(`${prefix}:applications`, 0, -1), redis.zrange<string[]>(`${prefix}:surveys`, 0, -1)])
    const [events, applications, coupons, surveys] = await Promise.all([
      Promise.all(eventIds.map(id => redis.get<ExperimentEvent>(`${prefix}:event:${id}`))),
      Promise.all(applicationIds.map(id => redis.get<Application>(`${prefix}:application:${id}`))),
      Promise.all(applicationIds.map(id => redis.get<Coupon>(`${prefix}:coupon:${id}`))),
      Promise.all(surveyIds.map(id => redis.get<SurveyResponse>(`${prefix}:survey:${id}`)))
    ])
    return { events: events.filter((e): e is ExperimentEvent => !!e), applications: applications.filter((a): a is Application => !!a), coupons: coupons.filter((c): c is Coupon => !!c), surveys: surveys.filter((s): s is SurveyResponse => !!s) }
  }
  return locked(async () => { const store = await readLocal(); store.applications = store.applications.filter(a => a.createdAt > cutoff()); store.events = store.events.filter(e => e.timestamp > cutoff()); await writeLocal(store); return store })
}
export function textValue(value: unknown, max = 100): string { return typeof value === 'string' ? value.trim().slice(0, max) : '' }
export const choices = {
  ownership: ['소유자이며 직접 관리하고 있어요', '가족 소유 주택을 관리하고 있어요', '아직 관리 중인 주택은 없어요'],
  houseType: ['상속받은 시골집', '주말주택 / 세컨드하우스', '비워둔 단독주택', '기타 주택'],
  lastVisit: ['1개월 이내', '1~3개월 전', '3~6개월 전', '6개월 이상 전', '아직 방문한 적 없어요'],
  purpose: ['집의 외부 상태 확인', '실내 상태 / 누수 확인', '청소 / 수리 / 제초', '휴식 / 가족 방문', '기타 / 방문한 적 없음'],
  currentMethod: ['직접 방문', '이웃 / 지인에게 부탁', 'CCTV / 원격 장비', '관리인 / 기존 서비스', '별도로 확인하지 않음'],
  frequency: ['월 1회', '월 2회', '필요할 때 1회', '상담 후 결정'],
  priceIntent: ['조건이 맞으면 유료로 이용하고 싶어요', '리포트를 더 확인한 후 결정하고 싶어요', '가격이 부담돼요', '외부 점검만으로는 부족해요', '지역 주민의 방문이 걱정돼요', '지금은 필요하지 않아요'],
} as const
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try { return new URL(origin).host === (request.headers.get('host') || new URL(request.url).host) }
  catch { return false }
}

export async function issueCoupon(requestId: string, applicationId: string): Promise<Coupon> {
  function validate(application: Application | null | undefined) {
    if (!application || application.id !== applicationId) throw new Error('RESERVATION_NOT_FOUND')
    if (application.priceIntent !== paidIntent || application.priceConfirmed !== true || application.offeredPrice !== PILOT_OFFER.unitPrice) throw new Error('NOT_A_PAID_RESERVATION')
    const expiresAt = new Date(new Date(application.createdAt).getTime() + PILOT_OFFER.couponValidityDays * 86400000).toISOString()
    if (expiresAt <= new Date().toISOString()) throw new Error('COUPON_EXPIRED')
    return { application, expiresAt }
  }
  function makeCoupon(application: Application, expiresAt: string): Coupon {
    return { code: `JIBON-${crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`, applicationId: application.id, requestId, issuedAt: new Date().toISOString(), expiresAt, discount: PILOT_OFFER.firstPaymentDiscount, offeredPrice: application.offeredPrice!, billingUnit: application.billingUnit }
  }
  if (redis) {
    const { application, expiresAt } = validate(await redis.get<Application>(`${prefix}:application:${requestId}`))
    const key = `${prefix}:coupon:${requestId}`
    const coupon = makeCoupon(application, expiresAt)
    const saved = await redis.set(key, coupon, { nx: true, ex: Math.max(1, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)) })
    const result = saved ? coupon : await redis.get<Coupon>(key)
    if (!result) throw new Error('SAVE_FAILED')
    return result
  }
  return locked(async () => {
    const store = await readLocal()
    const { application, expiresAt } = validate(store.applications.find(a => a.requestId === requestId))
    const existing = store.coupons.find(c => c.applicationId === applicationId)
    if (existing) return existing
    const coupon = makeCoupon(application, expiresAt)
    store.coupons.push(coupon); await writeLocal(store)
    return coupon
  })
}

export async function saveSurvey(survey: SurveyResponse): Promise<SurveyResponse> {
  if (redis) {
    const key = `${prefix}:survey:${survey.requestId}`
    const saved = await redis.set(key, survey, { nx: true, ex: 90 * 86400 })
    const result = saved ? survey : await redis.get<SurveyResponse>(key)
    if (!result) throw new Error('SAVE_FAILED')
    await redis.zadd(`${prefix}:surveys`, { score: new Date(result.createdAt).getTime(), member: survey.requestId })
    return result
  }
  return locked(async () => {
    const store = await readLocal()
    const existing = store.surveys.find(s => s.requestId === survey.requestId)
    if (existing) return existing
    store.surveys.push(survey); await writeLocal(store); return survey
  })
}
export async function getSurvey(requestId: string): Promise<SurveyResponse | null> {
  if (redis) return redis.get<SurveyResponse>(`${prefix}:survey:${requestId}`)
  return locked(async () => (await readLocal()).surveys.find(s => s.requestId === requestId) || null)
}
