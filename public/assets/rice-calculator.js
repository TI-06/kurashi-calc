export const GRAMS_PER_BOWL = 65;
export const BAG_SIZE_KG = 5;
export const DEFAULT_PRICE_PER_5KG = 3373;
export const PRICE_REFERENCE_DATE = '2026-07-24';
export const PRICE_REFERENCE_PERIOD = '2026-07-13〜2026-07-19';

const MIN_COUNT = 0;
const MAX_COUNT = 12;
const MIN_BOWLS_PER_PERSON = 0.5;
const MAX_BOWLS_PER_PERSON = 5;
const MIN_PRICE_PER_5KG = 1;
const MAX_PRICE_PER_5KG = 100000;

export function clampCount(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return MIN_COUNT;
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.trunc(numericValue)));
}

export function calculateRice({
  adults,
  children,
  days,
  bowlsPerPerson,
  pricePer5kg = DEFAULT_PRICE_PER_5KG,
}) {
  const adultCount = clampCount(adults);
  const childCount = clampCount(children);
  const familyMembers = adultCount + childCount;
  const dayCount = Number(days);
  const bowlCount = Number(bowlsPerPerson);
  const bagPrice = Math.round(Number(pricePer5kg));

  if (familyMembers < 1) {
    throw new RangeError('大人または子どもを1人以上指定してください。');
  }
  if (!Number.isInteger(dayCount) || dayCount < 1) {
    throw new RangeError('期間は1日以上で指定してください。');
  }
  if (
    !Number.isFinite(bowlCount) ||
    bowlCount < MIN_BOWLS_PER_PERSON ||
    bowlCount > MAX_BOWLS_PER_PERSON
  ) {
    throw new RangeError('1人1日のご飯量は0.5〜5杯で指定してください。');
  }
  if (
    !Number.isInteger(bagPrice) ||
    bagPrice < MIN_PRICE_PER_5KG ||
    bagPrice > MAX_PRICE_PER_5KG
  ) {
    throw new RangeError('5kgの価格は1〜100,000円で指定してください。');
  }

  const dailyBowls = familyMembers * bowlCount;
  const rawKilograms = (dailyBowls * dayCount * GRAMS_PER_BOWL) / 1000;
  const kilograms = Math.round(rawKilograms * 10) / 10;
  const bagCount = Math.ceil(rawKilograms / BAG_SIZE_KG);

  return {
    familyMembers,
    dailyBowls,
    kilograms,
    bagCount,
    estimatedCost: bagCount * bagPrice,
  };
}

export function formatYen(value) {
  return `${Math.round(Number(value)).toLocaleString('ja-JP')}円`;
}
