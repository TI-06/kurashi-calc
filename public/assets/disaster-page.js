import { calculateDisasterStockpile } from './disaster-calculator.js';
import { getNextCount } from './ui-helpers.js';

const form = document.querySelector('#disaster-calculator');
const scope = form?.closest('[data-calculator-scope]');
function set(selector, value) { const el = scope?.querySelector(selector); if (el) el.textContent = value; }
function syncCounter(name, value) {
  const input = form.elements.namedItem(name); const output = form.querySelector(`#${name}-output`);
  input.value = String(value); output.value = String(value); output.textContent = String(value);
}
function read() { const data = new FormData(form); return { adults: Number(data.get('adults')), children: Number(data.get('children')), days: Number(data.get('days')) }; }
function render({ focus = false } = {}) {
  const error = form.querySelector('[data-form-error]');
  try {
    const input = read(); const result = calculateDisasterStockpile(input);
    set('[data-stock-water]', `${result.waterLiters.toLocaleString('ja-JP')}L`);
    set('[data-stock-bottles]', `${result.twoLiterBottles.toLocaleString('ja-JP')}本`);
    set('[data-stock-meals]', `${result.meals.toLocaleString('ja-JP')}食`);
    set('[data-stock-toilets]', `${result.portableToilets.toLocaleString('ja-JP')}回分`);
    set('[data-stock-paper]', `${result.toiletPaperRolls.toLocaleString('ja-JP')}ロール`);
    set('[data-stock-gas]', `${result.gasCanisters.toLocaleString('ja-JP')}本`);
    set('[data-stock-formula]', `${result.people}人 × ${input.days}日分`);
    error.hidden = true; error.textContent = '';
    if (focus) scope.querySelector('[data-result]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (e) { error.textContent = e.message; error.hidden = false; }
}
form?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-counter]'); if (!button) return;
  const name = button.dataset.counter; const delta = button.dataset.action === 'increase' ? 1 : -1;
  syncCounter(name, getNextCount(form.elements.namedItem(name).value, delta)); render();
});
form?.addEventListener('change', () => render());
form?.addEventListener('submit', (event) => { event.preventDefault(); render({ focus: true }); });
render();
