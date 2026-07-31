import { calculateRice, clampCount, formatYen } from './rice-calculator.js';

export function createRiceViewModel(input) {
  const result = calculateRice(input);
  return {
    periodText: `${Number(input.days)}日間の目安`,
    kilogramsText: result.kilograms.toFixed(1),
    bagCountText: String(result.bagCount),
    costText: formatYen(result.estimatedCost),
  };
}

export function getNextCount(current, delta) {
  return clampCount(Number(current) + Number(delta));
}
