const ADULT_GRAMS_PER_MEAL = 100;
const CHILD_GRAMS_PER_MEAL = 80;
const BAG_SIZE_KG = 5;
const PRICE_PER_KG = 900;
const MIN_COUNT = 0;
const MAX_COUNT = 12;

export function clampCount(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return MIN_COUNT;
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.trunc(numericValue)));
}

export function calculateRice({ adults, children, days, meals }) {
  const adultCount = clampCount(adults);
  const childCount = clampCount(children);
  const dayCount = Number(days);
  const mealCount = Number(meals);

  if (adultCount + childCount < 1) {
    throw new RangeError('大人または子どもを1人以上指定してください。');
  }
  if (!Number.isInteger(dayCount) || dayCount < 1) {
    throw new RangeError('期間は1日以上で指定してください。');
  }
  if (!Number.isInteger(mealCount) || mealCount < 1 || mealCount > 3) {
    throw new RangeError('1日の食事回数は1〜3回で指定してください。');
  }

  const gramsPerMeal =
    adultCount * ADULT_GRAMS_PER_MEAL + childCount * CHILD_GRAMS_PER_MEAL;
  const rawKilograms = (gramsPerMeal * mealCount * dayCount) / 1000;
  const kilograms = Math.round(rawKilograms * 10) / 10;

  return {
    kilograms,
    bagCount: Math.ceil(kilograms / BAG_SIZE_KG),
    estimatedCost: Math.round(kilograms * PRICE_PER_KG),
  };
}

export function formatYen(value) {
  return `${Math.round(Number(value)).toLocaleString('ja-JP')}円`;
}
