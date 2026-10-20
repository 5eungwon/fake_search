// Shared by the page and API so the displayed offer matches the saved experiment.
export const PILOT_OFFER = {
  version: 'per-visit-9900-v1',
  billingUnit: 'per_visit',
  unitPrice: 9900,
  firstPaymentDiscount: 1000,
  couponValidityDays: 90,
} as const
export const priceLabel = PILOT_OFFER.unitPrice.toLocaleString('ko-KR')
export const discountLabel = PILOT_OFFER.firstPaymentDiscount.toLocaleString('ko-KR')
export const firstPaymentLabel = (PILOT_OFFER.unitPrice - PILOT_OFFER.firstPaymentDiscount).toLocaleString('ko-KR')
export const paidIntent = '조건이 맞으면 유료로 이용하고 싶어요'
