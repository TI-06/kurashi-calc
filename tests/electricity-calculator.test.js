import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateElectricity, DEFAULT_ELECTRICITY_RATE } from '../public/assets/electricity-calculator.js';

test('550Wを1日8時間・30日使う電気代を計算する', () => {
  const result = calculateElectricity({ watts: 550, hoursPerDay: 8, days: 30, units: 1, ratePerKwh: 31 });
  assert.equal(result.kwh, 132);
  assert.equal(result.cost, 4092);
  assert.equal(result.dailyCost, 136.4);
});

test('電気料金目安単価の初期値は31円/kWh', () => {
  assert.equal(DEFAULT_ELECTRICITY_RATE, 31);
});

test('不正な電力・時間はエラーにする', () => {
  assert.throws(() => calculateElectricity({ watts: 0, hoursPerDay: 8, days: 30, units: 1, ratePerKwh: 31 }), RangeError);
  assert.throws(() => calculateElectricity({ watts: 500, hoursPerDay: 25, days: 30, units: 1, ratePerKwh: 31 }), RangeError);
});
