export const DEFAULT_ELECTRICITY_RATE = 31;

function requireNumber(value, { min, max, label }) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    throw new RangeError(`${label}は${min}〜${max}の範囲で指定してください。`);
  }
  return number;
}

export function calculateElectricity({ watts, hoursPerDay, days, units, ratePerKwh = DEFAULT_ELECTRICITY_RATE }) {
  const power = requireNumber(watts, { min: 1, max: 100000, label: '消費電力' });
  const hours = requireNumber(hoursPerDay, { min: 0.1, max: 24, label: '1日の使用時間' });
  const dayCount = requireNumber(days, { min: 1, max: 366, label: '使用日数' });
  const unitCount = requireNumber(units, { min: 1, max: 100, label: '台数' });
  const rate = requireNumber(ratePerKwh, { min: 1, max: 1000, label: '電気料金単価' });
  const rawKwh = (power / 1000) * hours * dayCount * unitCount;
  const rawCost = rawKwh * rate;

  return {
    kwh: Math.round(rawKwh * 100) / 100,
    cost: Math.round(rawCost),
    dailyCost: Math.round((rawCost / dayCount) * 10) / 10,
    hourlyCost: Math.round(((power / 1000) * unitCount * rate) * 10) / 10,
  };
}
