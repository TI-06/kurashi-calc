import { calculatePoolWater } from './pool-calculator.js';

const form = document.querySelector('#pool-calculator');
const scope = form?.closest('[data-calculator-scope]');
const shape = form?.elements.shape;
function yen(value) { return `${Math.round(value).toLocaleString('ja-JP')}円`; }
function set(selector, value) { const el = scope?.querySelector(selector); if (el) el.textContent = value; }
function syncShape() {
  const circle = shape.value === 'circle';
  form.querySelectorAll('[data-rectangle-field]').forEach((el) => { el.hidden = circle; el.querySelectorAll('input').forEach((i) => { i.disabled = circle; }); });
  form.querySelectorAll('[data-circle-field]').forEach((el) => { el.hidden = !circle; el.querySelectorAll('input').forEach((i) => { i.disabled = !circle; }); });
}
function read() {
  const data = new FormData(form);
  return {
    shape: String(data.get('shape')),
    lengthCm: Number(data.get('lengthCm') || 0), widthCm: Number(data.get('widthCm') || 0), diameterCm: Number(data.get('diameterCm') || 0),
    waterDepthCm: Number(data.get('waterDepthCm')), fills: Number(data.get('fills')), ratePerM3: Number(data.get('ratePerM3')),
  };
}
function render({ focus = false } = {}) {
  const error = form.querySelector('[data-form-error]');
  try {
    const input = read(); const result = calculatePoolWater(input);
    set('[data-pool-liters]', result.liters.toLocaleString('ja-JP'));
    set('[data-pool-m3]', result.cubicMeters.toLocaleString('ja-JP', { maximumFractionDigits: 3 }));
    set('[data-pool-cost]', yen(result.cost));
    set('[data-pool-bottles]', Math.ceil(result.liters / 2).toLocaleString('ja-JP'));
    const dimension = input.shape === 'circle' ? `直径${input.diameterCm}cm` : `${input.lengthCm}cm × ${input.widthCm}cm`;
    set('[data-pool-formula]', `${dimension} × 水深${input.waterDepthCm}cm × ${input.fills}回（単価${input.ratePerM3}円/m³）`);
    error.hidden = true; error.textContent = '';
    if (focus) scope.querySelector('[data-result]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (e) { error.textContent = e.message; error.hidden = false; }
}
shape?.addEventListener('change', () => { syncShape(); render(); });
form?.addEventListener('input', (event) => {
  if (event.target === shape) syncShape();
  render();
});
form?.addEventListener('change', () => render());
form?.addEventListener('submit', (event) => { event.preventDefault(); render({ focus: true }); });
syncShape(); render();
