import test from 'node:test';
import assert from 'node:assert/strict';
import { createRiceViewModel, getNextCount } from '../public/assets/ui-helpers.js';

test('計算結果を根拠付きの画面表示用文字列へ変換する', () => {
  assert.deepEqual(
    createRiceViewModel({
      adults: 3,
      children: 2,
      days: 30,
      bowlsPerPerson: 1.5,
      pricePer5kg: 3373,
    }),
    {
      periodText: '30日間の目安',
      kilogramsText: '14.6',
      bagCountText: '3',
      costText: '10,119円',
      dailyBowlsText: '7.5杯',
      formulaText: '5人 × 1日1.5杯 × 30日 × 生米65g',
      priceFormulaText: '3袋 × 3,373円',
    },
  );
});

test('カウンター操作は増減後も0から12に収まる', () => {
  assert.equal(getNextCount(12, 1), 12);
  assert.equal(getNextCount(0, -1), 0);
  assert.equal(getNextCount(4, -1), 3);
});
