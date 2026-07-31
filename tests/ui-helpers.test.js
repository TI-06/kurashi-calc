import test from 'node:test';
import assert from 'node:assert/strict';
import { createRiceViewModel, getNextCount } from '../public/assets/ui-helpers.js';

test('計算結果を画面表示用の文字列へ変換する', () => {
  assert.deepEqual(
    createRiceViewModel({ adults: 2, children: 2, days: 30, meals: 2 }),
    {
      periodText: '30日間の目安',
      kilogramsText: '21.6',
      bagCountText: '5',
      costText: '19,440円',
    },
  );
});

test('カウンター操作は増減後も0から12に収まる', () => {
  assert.equal(getNextCount(12, 1), 12);
  assert.equal(getNextCount(0, -1), 0);
  assert.equal(getNextCount(4, -1), 3);
});
