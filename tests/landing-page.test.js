import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readIndex = () => readFile(new URL('../public/index.html', import.meta.url), 'utf8');

test('トップLPに主要ランドマークと承認済みセクションがある', async () => {
  const html = await readIndex();

  for (const fragment of [
    '<header',
    '<main',
    '<footer',
    'id="hero"',
    'id="popular-tools"',
    'id="categories"',
    'id="how-it-works"',
    'id="trust"',
    'id="articles"',
  ]) {
    assert.match(html, new RegExp(fragment));
  }
});

test('お米計算フォームがアクセシブルな入力と結果領域を持つ', async () => {
  const html = await readIndex();

  assert.match(html, /<form[^>]+id="rice-calculator"/);
  assert.match(html, /name="adults"/);
  assert.match(html, /name="children"/);
  assert.match(html, /name="days"/);
  assert.match(html, /name="bowlsPerPerson"/);
  assert.match(html, /name="pricePer5kg"/);
  assert.match(html, /3,373円/);
  assert.match(html, /2026年7月24日公表/);
  assert.match(html, /計算根拠/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /type="module" src="\/assets\/app\.js"/);
});

test('広告プレースホルダーは操作フォームの外側に2件ある', async () => {
  const html = await readIndex();
  const ads = html.match(/data-ad-slot/g) ?? [];

  assert.equal(ads.length, 2);
  const formStart = html.indexOf('<form');
  const formEnd = html.indexOf('</form>');
  const firstAd = html.indexOf('data-ad-slot');
  assert.ok(firstAd < formStart || firstAd > formEnd);
});

test('SEOに必要な基本メタ情報がある', async () => {
  const html = await readIndex();

  assert.match(html, /<title>くらし算/);
  assert.match(html, /name="description"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /lang="ja"/);
});
