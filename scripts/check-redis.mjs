import nextEnv from '@next/env'
import { Redis } from '@upstash/redis'
import { randomUUID } from 'node:crypto'
nextEnv.loadEnvConfig(process.cwd())
const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN
if (!url || !token) {
  console.error('Redis 연결 정보가 없습니다. .env.local의 UPSTASH_REDIS_REST_URL과 UPSTASH_REDIS_REST_TOKEN을 설정해주세요.')
  process.exit(1)
}
const key = `jibon:connection-test:${randomUUID()}`
const redis = new Redis({ url, token })
try {
  await redis.set(key, 'connected', { ex: 60 })
  if (await redis.get(key) !== 'connected') throw new Error('READ_BACK_FAILED')
  await redis.del(key)
  console.log('Upstash Redis 연결 성공: 테스트 데이터 쓰기·읽기·삭제 완료. 인증 정보는 출력하지 않았습니다.')
} catch {
  console.error('Redis 연결 확인 실패. REST URL, 쓰기 권한이 있는 토큰과 네트워크를 확인해주세요.')
  process.exitCode = 1
} finally {
  if (process.exitCode) await redis.del(key).catch(() => {})
}
