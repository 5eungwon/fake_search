export const delayDurations = ['미룬 적 없음', '1주 미만', '1주 이상 ~ 1개월 미만', '1개월 이상 ~ 3개월 미만', '3개월 이상 ~ 6개월 미만', '6개월 이상', '직접 입력', '잘 기억나지 않음'] as const
export function delayedFromDuration(duration: string): boolean | null {
  if (duration === '미룬 적 없음') return false
  if (duration === '잘 기억나지 않음' || !duration) return null
  return (delayDurations as readonly string[]).includes(duration) ? true : null
}
export const managementOptions = ['직접 방문해 관리한다', '가족이나 지인에게 부탁한다', '지역 주민 또는 관리업체에 맡긴다', 'CCTV 등으로 원격 확인한다', '필요할 때만 가끔 방문한다', '거의 관리하지 않음', '기타'] as const
export const delayReasons = ['시간이 부족해서', '거리가 멀어서 이동이 부담돼서', '관리하는 과정이 귀찮고 번거로워서', '지인에게 부탁하기 부담스러워서', '관리 비용이 부담돼서', '우선순위가 높지 않아서', '기타'] as const
export type SurveyResponse = { id: string; requestId: string; createdAt: string; hasHouse: boolean; managementMethods: string[]; managementOther: string; delayed: boolean | null; delayDuration?: string | null; delayDurationOther?: string; delayReason: string | null; delayOther: string; source: string; campaign: string; variant: string }
export function isCoreTarget(survey: SurveyResponse) {
  return survey.hasHouse && survey.delayed === true && delayReasons.slice(0, 4).some(reason => reason === survey.delayReason)
}
