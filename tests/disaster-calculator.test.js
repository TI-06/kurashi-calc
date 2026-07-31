import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDisasterStockpile } from '../public/assets/disaster-calculator.js';

test('5人家族の7日分の備蓄量を計算する', () => {
  const result = calculateDisasterStockpile({ adults: 3, children: 2, days: 7 });
  assert.equal(result.people, 5);
  assert.equal(result.waterLiters, 105);
  assert.equal(result.twoLiterBottles, 53);
  assert.equal(result.meals, 105);
  assert.equal(result.portableToilets, 175);
  assert.equal(result.toiletPaperRolls, 5);
  assert.equal(result.gasCanisters, 30);
});

test('人数0人はエラーにする', () => {
  assert.throws(() => calculateDisasterStockpile({ adults: 0, children: 0, days: 3 }), RangeError);
});
