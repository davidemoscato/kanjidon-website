(() => {
  const selector = document.querySelector('.travel-page .language-selector');
  const button = selector?.querySelector('.language-btn');
  const menu = selector?.querySelector('.language-dropdown');
  if (!selector || !button || !menu) return;
  selector.dataset.enhanced = 'true';
  menu.id = 'article-language-options';
  button.setAttribute('aria-controls', menu.id);
  const setOpen = open => {
    selector.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };
  setOpen(false);
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  button.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault(); setOpen(true); menu.querySelector('a')?.focus();
    }
  });
  selector.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault(); setOpen(false); button.focus();
    }
  });
  selector.addEventListener('focusout', event => { if (!selector.contains(event.relatedTarget)) setOpen(false); });
  document.addEventListener('click', event => { if (!selector.contains(event.target)) setOpen(false); });
})();
