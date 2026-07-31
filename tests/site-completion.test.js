import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../public/', import.meta.url));

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  }));
  return nested.flat();
}

function resolvePublic(href) {
  const clean = href.split(/[?#]/, 1)[0];
  if (!clean.startsWith('/') || clean.startsWith('//')) return null;
  const relative = clean.slice(1);
  if (!relative) return path.join(root, 'index.html');
  if (path.extname(relative)) return path.join(root, relative);
  return path.join(root, relative, 'index.html');
}

test('初期公開に必要な17ページが存在する', async () => {
  const required = [
    'index.html','tools/index.html','tools/rice/index.html','tools/electricity/index.html','tools/pool-water/index.html','tools/disaster-stockpile/index.html',
    'categories/index.html','articles/index.html','articles/rice-monthly-guide/index.html','articles/electricity-cost-guide/index.html',
    'articles/pool-water-cost-guide/index.html','articles/disaster-stockpile-guide/index.html','search/index.html','about/index.html','contact/index.html','privacy/index.html','terms/index.html',
  ];
  for (const file of required) await assert.doesNotReject(access(path.join(root, file)), file);
});

test('全HTMLのローカルリンクと静的参照先が存在する', async () => {
  const htmlFiles = (await walk(root)).filter((file) => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = match[1];
      if (href.startsWith('/assets/icons.svg#')) continue;
      const target = resolvePublic(href);
      if (target) await assert.doesNotReject(access(target), `${path.relative(root,file)} -> ${href}`);
    }
  }
});

test('全インデックス対象ページに固有タイトル・説明・canonicalがある', async () => {
  const htmlFiles = (await walk(root)).filter((file) => file.endsWith('index.html'));
  const titles = new Set();
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title, path.relative(root,file));
    assert.ok(!titles.has(title), `duplicate title: ${title}`);
    titles.add(title);
    assert.match(html, /<meta name="description" content="[^"]{20,}"/);
    assert.match(html, /<link rel="canonical" href="https:\/\/kurashi-calc\.workers\.dev\/[^"]*"/);
  }
});

test('計算ツール4ページがフォーム・結果・根拠・広告導線を持つ', async () => {
  const pages = ['rice','electricity','pool-water','disaster-stockpile'];
  for (const slug of pages) {
    const html = await readFile(path.join(root, 'tools', slug, 'index.html'), 'utf8');
    assert.match(html, /<form id="[^"]+-calculator"/);
    assert.match(html, /data-result/);
    assert.match(html, /参照元と計算上の注意/);
    assert.match(html, /data-ad-slot/);
  }
});

test('静的アセットを長期間ブラウザキャッシュしない', async () => {
  const headers = await readFile(path.join(root, '_headers'), 'utf8');
  assert.match(headers, /Cache-Control: public, max-age=0, must-revalidate/);
  assert.doesNotMatch(headers, /max-age=604800/);
});

test('公開用ページに仮の問い合わせ先や未実装表示が残っていない', async () => {
  const files = await walk(root);
  const textFiles = files.filter((f) => /\.(?:html|js|css|txt|xml)$/.test(f));
  const combined = (await Promise.all(textFiles.map((f) => readFile(f, 'utf8')))).join('\n');
  assert.doesNotMatch(combined, /contact@kurashi-calc\.example/);
  assert.doesNotMatch(combined, /次の実装で追加します/);
});


test('非公開の連携アカウント情報を公開HTMLへ含めない', async () => {
  const htmlFiles = (await walk(root)).filter((file) => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    assert.doesNotMatch(html, /iretaku\.shop@gmail\.com/i, path.relative(root, file));
  }
});


test('形状別の入力欄はhidden属性で確実に非表示になる', async () => {
  const css = await readFile(path.join(root, 'assets', 'styles-pages.css'), 'utf8');
  assert.match(css, /\.form-field\[hidden\]\s*\{\s*display:\s*none/);
});
