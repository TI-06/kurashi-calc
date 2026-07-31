import { createRiceViewModel, getNextCount } from './ui-helpers.js';

const calculator = document.querySelector('#rice-calculator');
const errorElement = document.querySelector('[data-form-error]');
const resultPeriod = document.querySelector('[data-result-period]');
const resultKg = document.querySelector('[data-result-kg]');
const resultBags = document.querySelector('[data-result-bags]');
const resultCost = document.querySelector('[data-result-cost]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const toast = document.querySelector('[data-toast]');
let toastTimer;

function readCalculatorValues() {
  const formData = new FormData(calculator);
  return {
    adults: Number(formData.get('adults')),
    children: Number(formData.get('children')),
    days: Number(formData.get('days')),
    meals: Number(formData.get('meals')),
  };
}

function syncCounter(name, value) {
  const input = calculator.elements.namedItem(name);
  const output = document.querySelector(`#${name}-output`);
  input.value = String(value);
  output.value = String(value);
  output.textContent = String(value);
}

function renderResult({ focus = false } = {}) {
  try {
    const viewModel = createRiceViewModel(readCalculatorValues());
    resultPeriod.textContent = viewModel.periodText;
    resultKg.textContent = viewModel.kilogramsText;
    resultBags.textContent = viewModel.bagCountText;
    resultCost.textContent = viewModel.costText;
    errorElement.hidden = true;
    errorElement.textContent = '';

    if (focus) {
      document.querySelector('[data-result]').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } catch (error) {
    errorElement.textContent = error instanceof Error ? error.message : '入力内容を確認してください。';
    errorElement.hidden = false;
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 3200);
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

calculator?.addEventListener('change', (event) => {
  if (event.target.matches('select, input')) renderResult();
});

calculator?.addEventListener('submit', (event) => {
  event.preventDefault();
  renderResult({ focus: true });
});

menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  mobileMenu.hidden = expanded;
  document.body.classList.toggle('menu-open', !expanded);
  menuButton.querySelector('.sr-only').textContent = expanded ? 'メニューを開く' : 'メニューを閉じる';
});

mobileMenu?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
});

document.querySelectorAll('[data-search-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = new FormData(form).get('q')?.toString().trim();
    showToast(query ? `「${query}」の検索機能は次の実装で追加します。` : '検索キーワードを入力してください。');
  });
});

renderResult();
