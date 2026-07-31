import {
  calculateRice,
  clampCount,
  formatYen,
  GRAMS_PER_BOWL,
} from './rice-calculator.js';

function formatNumber(value) {
  return Number(value).toLocaleString('ja-JP', {
    maximumFractionDigits: 1,
  });
}

export function createRiceViewModel(input) {
  const result = calculateRice(input);
  const bowlsPerPerson = Number(input.bowlsPerPerson);
  const pricePer5kg = Math.round(Number(input.pricePer5kg));

  return {
    periodText: `${Number(input.days)}日間の目安`,
    kilogramsText: result.kilograms.toFixed(1),
    bagCountText: String(result.bagCount),
    costText: formatYen(result.estimatedCost),
    dailyBowlsText: `${formatNumber(result.dailyBowls)}杯`,
    formulaText: `${result.familyMembers}人 × 1日${formatNumber(bowlsPerPerson)}杯 × ${Number(input.days)}日 × 生米${GRAMS_PER_BOWL}g`,
    priceFormulaText: `${result.bagCount}袋 × ${pricePer5kg.toLocaleString('ja-JP')}円`,
  };
}

export function getNextCount(current, delta) {
  return clampCount(Number(current) + Number(delta));
}
