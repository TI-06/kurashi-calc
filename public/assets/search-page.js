import { SEARCH_ITEMS } from './search-data.js';
const form = document.querySelector('[data-search-page-form]');
const input = form?.elements.q;
const results = document.querySelector('[data-search-results]');
const summary = document.querySelector('[data-search-summary]');
function normalize(value) { return value.toLocaleLowerCase('ja-JP').replace(/[\s　]+/g, ' ').trim(); }
function search(query) {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (!terms.length) return SEARCH_ITEMS;
  return SEARCH_ITEMS.map((item) => {
    const title = normalize(item.title); const text = normalize(`${item.title} ${item.keywords} ${item.description}`);
    const score = terms.reduce((total, term) => total + (title.includes(term) ? 5 : 0) + (text.includes(term) ? 1 : 0), 0);
    return { ...item, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'ja'));
}
function render(query) {
  const items = search(query);
  summary.textContent = query ? `「${query}」の検索結果：${items.length}件` : `すべてのページ：${items.length}件`;
  results.replaceChildren(...items.map((item) => {
    const article = document.createElement('article'); article.className = 'search-result-card';
    const tag = document.createElement('span'); tag.className = 'content-type'; tag.textContent = item.type;
    const title = document.createElement('h2'); const link = document.createElement('a'); link.href = item.url; link.textContent = item.title; title.append(link);
    const description = document.createElement('p'); description.textContent = item.description;
    article.append(tag, title, description); return article;
  }));
  if (!items.length) results.innerHTML = '<p class="empty-state">該当するページがありません。別のキーワードで検索してください。</p>';
}
const params = new URLSearchParams(location.search); input.value = params.get('q') ?? ''; render(input.value);
form?.addEventListener('submit', (event) => { event.preventDefault(); const q = input.value.trim(); history.replaceState(null, '', q ? `?q=${encodeURIComponent(q)}` : location.pathname); render(q); });
