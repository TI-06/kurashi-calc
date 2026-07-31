import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePoolWater, DEFAULT_WATER_RATE } from '../public/assets/pool-calculator.js';

test('長方形プールの水量と料金を計算する', () => {
  const result = calculatePoolWater({ shape: 'rectangle', lengthCm: 200, widthCm: 150, diameterCm: 0, waterDepthCm: 40, fills: 1, ratePerM3: 330 });
  assert.equal(result.liters, 1200);
  assert.equal(result.cubicMeters, 1.2);
  assert.equal(result.cost, 396);
});

test('円形プールの水量を計算する', () => {
  const result = calculatePoolWater({ shape: 'circle', lengthCm: 0, widthCm: 0, diameterCm: 180, waterDepthCm: 35, fills: 2, ratePerM3: 330 });
  assert.equal(result.liters, 1781);
  assert.equal(result.cost, 588);
});

test('上下水道の初期目安単価は330円/m3', () => {
  assert.equal(DEFAULT_WATER_RATE, 330);
});
