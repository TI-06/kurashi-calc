import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRice,
  clampCount,
  formatYen,
  DEFAULT_PRICE_PER_5KG,
  GRAMS_PER_BOWL,
  PRICE_REFERENCE_DATE,
} from '../public/assets/rice-calculator.js';

test('標準設定では大人3人と子ども2人の30日分が約14.6kg・5kg袋3袋になる', () => {
  const result = calculateRice({
    adults: 3,
    children: 2,
    days: 30,
    bowlsPerPerson: 1.5,
    pricePer5kg: DEFAULT_PRICE_PER_5KG,
  });

  assert.deepEqual(result, {
    familyMembers: 5,
    dailyBowls: 7.5,
    kilograms: 14.6,
    bagCount: 3,
    estimatedCost: 10119,
  });
});

test('必要量は茶碗1杯あたり生米65gで計算し小数第1位へ丸める', () => {
  const result = calculateRice({
    adults: 1,
    children: 1,
    days: 7,
    bowlsPerPerson: 1,
    pricePer5kg: DEFAULT_PRICE_PER_5KG,
  });

  assert.equal(GRAMS_PER_BOWL, 65);
  assert.equal(result.kilograms, 0.9);
  assert.equal(result.bagCount, 1);
  assert.equal(result.estimatedCost, 3373);
});

test('概算費用は切り上げた5kg袋数と入力価格から計算する', () => {
  const result = calculateRice({
    adults: 3,
    children: 2,
    days: 30,
    bowlsPerPerson: 1.5,
    pricePer5kg: 4200,
  });

  assert.equal(result.bagCount, 3);
  assert.equal(result.estimatedCost, 12600);
});

test('人数カウンターは0から12の範囲に制限する', () => {
  assert.equal(clampCount(-1), 0);
  assert.equal(clampCount(6), 6);
  assert.equal(clampCount(13), 12);
});

test('概算費用を日本円表記に整形する', () => {
  assert.equal(formatYen(10119), '10,119円');
});

test('初期価格と参照日は最新の公表値を保持する', () => {
  assert.equal(DEFAULT_PRICE_PER_5KG, 3373);
  assert.equal(PRICE_REFERENCE_DATE, '2026-07-24');
});

test('全員0人は入力エラーにする', () => {
  assert.throws(
    () =>
      calculateRice({
        adults: 0,
        children: 0,
        days: 30,
        bowlsPerPerson: 1.5,
        pricePer5kg: DEFAULT_PRICE_PER_5KG,
      }),
    /1人以上/,
  );
});
