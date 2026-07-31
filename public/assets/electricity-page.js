import { calculateElectricity } from './electricity-calculator.js';

const form = document.querySelector('#electricity-calculator');
const scope = form?.closest('[data-calculator-scope]');
const preset = form?.querySelector('[data-electric-preset]');

const presets = {
  aircon: 550,
  fan: 35,
  tv: 150,
  dryer: 1200,
  microwave: 1000,
};

function yen(value) { return `${Math.round(value).toLocaleString('ja-JP')}円`; }
function set(selector, value) { const el = scope?.querySelector(selector); if (el) el.textContent = value; }
function read() {
  const data = new FormData(form);
  return Object.fromEntries(['watts','hoursPerDay','days','units','ratePerKwh'].map((key) => [key, Number(data.get(key))]));
}
function render({ focus = false } = {}) {
  const error = form.querySelector('[data-form-error]');
  try {
    const input = read();
    const result = calculateElectricity(input);
    set('[data-electric-kwh]', result.kwh.toLocaleString('ja-JP', { maximumFractionDigits: 2 }));
    set('[data-electric-cost]', yen(result.cost));
    set('[data-electric-daily]', yen(result.dailyCost));
    set('[data-electric-hourly]', yen(result.hourlyCost));
    set('[data-electric-formula]', `${input.watts}W ÷ 1,000 × ${input.hoursPerDay}時間 × ${input.days}日 × ${input.units}台 × ${input.ratePerKwh}円`);
    error.hidden = true; error.textContent = '';
    if (focus) scope.querySelector('[data-result]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (e) { error.textContent = e.message; error.hidden = false; }
}
preset?.addEventListener('change', () => {
  if (presets[preset.value]) form.elements.watts.value = presets[preset.value];
  render();
});
form?.addEventListener('change', () => render());
form?.addEventListener('input', (event) => { if (event.target.matches('input')) render(); });
form?.addEventListener('submit', (event) => { event.preventDefault(); render({ focus: true }); });
render();
