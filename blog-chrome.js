// Behaviour for the blog's shared language selector.
(() => {
  const button = document.querySelector('.language-btn');
  const dropdown = document.querySelector('.language-dropdown');
  if (!button || !dropdown) return;
  button.setAttribute('aria-expanded', 'false');
  function close() {
    dropdown.classList.remove('show');
    button.setAttribute('aria-expanded', 'false');
  }
  button.addEventListener('click', event => {
    event.stopPropagation();
    button.setAttribute('aria-expanded', String(dropdown.classList.toggle('show')));
  });
  document.addEventListener('click', close);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dropdown.classList.contains('show')) {
      close();
      button.focus();
    }
  });
})();
