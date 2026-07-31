import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRice,
  clampCount,
  formatYen,
} from '../public/assets/rice-calculator.js';

test('初期条件では30日分のお米が21.6kgになる', () => {
  const result = calculateRice({ adults: 2, children: 2, days: 30, meals: 2 });

  assert.deepEqual(result, {
    kilograms: 21.6,
    bagCount: 5,
    estimatedCost: 19440,
  });
});

test('必要量は小数第1位に丸め、5kg袋数は切り上げる', () => {
  const result = calculateRice({ adults: 1, children: 1, days: 7, meals: 1 });

  assert.equal(result.kilograms, 1.3);
  assert.equal(result.bagCount, 1);
  assert.equal(result.estimatedCost, 1170);
});

test('人数カウンターは0から12の範囲に制限する', () => {
  assert.equal(clampCount(-1), 0);
  assert.equal(clampCount(6), 6);
  assert.equal(clampCount(13), 12);
});

test('概算費用を日本円表記に整形する', () => {
  assert.equal(formatYen(19440), '19,440円');
});

test('全員0人は入力エラーにする', () => {
  assert.throws(
    () => calculateRice({ adults: 0, children: 0, days: 30, meals: 2 }),
    /1人以上/,
  );
});
