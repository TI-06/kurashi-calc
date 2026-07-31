export const DEFAULT_WATER_RATE = 330;

function requireNumber(value, { min, max, label, allowZero = false }) {
  const number = Number(value);
  const lower = allowZero ? 0 : min;
  if (!Number.isFinite(number) || number < lower || number > max) {
    throw new RangeError(`${label}は${lower}〜${max}の範囲で指定してください。`);
  }
  return number;
}

export function calculatePoolWater({
  shape,
  lengthCm,
  widthCm,
  diameterCm,
  waterDepthCm,
  fills = 1,
  ratePerM3 = DEFAULT_WATER_RATE,
}) {
  if (!['rectangle', 'circle'].includes(shape)) {
    throw new RangeError('プールの形を指定してください。');
  }
  const depth = requireNumber(waterDepthCm, { min: 1, max: 300, label: '水深' });
  const fillCount = requireNumber(fills, { min: 1, max: 100, label: '水の入れ替え回数' });
  const rate = requireNumber(ratePerM3, { min: 1, max: 10000, label: '上下水道単価' });
  let volumeCm3;

  if (shape === 'rectangle') {
    const length = requireNumber(lengthCm, { min: 1, max: 3000, label: '長さ' });
    const width = requireNumber(widthCm, { min: 1, max: 3000, label: '幅' });
    volumeCm3 = length * width * depth;
  } else {
    const diameter = requireNumber(diameterCm, { min: 1, max: 3000, label: '直径' });
    volumeCm3 = Math.PI * ((diameter / 2) ** 2) * depth;
  }

  const rawLiters = (volumeCm3 / 1000) * fillCount;
  const rawCubicMeters = rawLiters / 1000;

  return {
    liters: Math.round(rawLiters),
    cubicMeters: Math.round(rawCubicMeters * 1000) / 1000,
    cost: Math.round(rawCubicMeters * rate),
    fills: fillCount,
  };
}
