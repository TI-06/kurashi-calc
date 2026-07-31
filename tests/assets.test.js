import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const publicRoot = fileURLToPath(new URL('../public/', import.meta.url));

test('トップページから参照するローカル静的ファイルが存在する', async () => {
  const html = await readFile(path.join(publicRoot, 'index.html'), 'utf8');
  const references = [...html.matchAll(/(?:src|href)="(\/(?:assets\/[^\"]+|favicon\.svg))"/g)]
    .map((match) => match[1].split(/[?#]/, 1)[0]);

  assert.ok(references.length > 10);
  for (const reference of new Set(references)) {
    await assert.doesNotReject(access(path.join(publicRoot, reference.slice(1))), reference);
  }
});

test('更新される静的資産を長期間ブラウザキャッシュしない', async () => {
  const headers = await readFile(path.join(publicRoot, '_headers'), 'utf8');
  assert.match(
    headers,
    /\/assets\/\*\s+Cache-Control: public, max-age=0, must-revalidate/s,
  );
  assert.doesNotMatch(headers, /max-age=604800/);
});
