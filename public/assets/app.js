import { createRiceViewModel, getNextCount } from './ui-helpers.js';

const calculator = document.querySelector('#rice-calculator');

function readCalculatorValues() {
  const formData = new FormData(calculator);
  return {
    adults: Number(formData.get('adults')),
    children: Number(formData.get('children')),
    days: Number(formData.get('days')),
    bowlsPerPerson: Number(formData.get('bowlsPerPerson')),
    pricePer5kg: Number(formData.get('pricePer5kg')),
  };
}

function syncCounter(name, value) {
  const input = calculator.elements.namedItem(name);
  const output = calculator.querySelector(`#${name}-output`);
  input.value = String(value);
  output.value = String(value);
  output.textContent = String(value);
}

function setText(selector, value) {
  const element = calculator.closest('[data-calculator-scope]')?.querySelector(selector) ?? document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderResult({ focus = false } = {}) {
  if (!calculator) return;
  const errorElement = calculator.querySelector('[data-form-error]');
  try {
    const viewModel = createRiceViewModel(readCalculatorValues());
    setText('[data-result-period]', viewModel.periodText);
    setText('[data-result-kg]', viewModel.kilogramsText);
    setText('[data-result-bags]', viewModel.bagCountText);
    setText('[data-result-cost]', viewModel.costText);
    setText('[data-result-daily-bowls]', viewModel.dailyBowlsText);
    setText('[data-result-formula]', viewModel.formulaText);
    setText('[data-result-price-formula]', viewModel.priceFormulaText);
    errorElement.hidden = true;
    errorElement.textContent = '';
    if (focus) document.querySelector('[data-result]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    errorElement.textContent = error instanceof Error ? error.message : '入力内容を確認してください。';
    errorElement.hidden = false;
  }
}

calculator?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-counter]');
  if (!button) return;
  const name = button.dataset.counter;
  const input = calculator.elements.namedItem(name);
  const delta = button.dataset.action === 'increase' ? 1 : -1;
  syncCounter(name, getNextCount(input.value, delta));
  renderResult();
});
calculator?.addEventListener('change', () => renderResult());
calculator?.addEventListener('submit', (event) => {
  event.preventDefault();
  renderResult({ focus: true });
});
renderResult();
