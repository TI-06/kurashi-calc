const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  mobileMenu.hidden = expanded;
  document.body.classList.toggle('menu-open', !expanded);
  const label = menuButton.querySelector('.sr-only');
  if (label) label.textContent = expanded ? 'メニューを開く' : 'メニューを閉じる';
});

mobileMenu?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menuButton?.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
});

const currentPath = window.location.pathname;
document.querySelectorAll('[data-nav-link]').forEach((link) => {
  const href = new URL(link.href, window.location.origin).pathname;
  if (href !== '/' && currentPath.startsWith(href)) link.setAttribute('aria-current', 'page');
});
