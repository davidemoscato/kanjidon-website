(() => {
  'use strict';
  const root = document.querySelector('.exam-day');
  if (!root) return;
  const text=JSON.parse(document.querySelector('#exam-day-text').textContent);
  const checks = [...root.querySelectorAll('.ed-checklist input[type="checkbox"]')];
  const updateChecks = () => {
    const count = checks.filter(input => input.checked).length;
    root.querySelector('#kit-progress').value = count;
    root.querySelector('#kit-status').textContent = count === checks.length
      ? text.ready
      : text.status.replace('{count}',String(count));
  };
  checks.forEach(input => input.addEventListener('change', updateChecks));
  root.querySelector('#reset-kit').addEventListener('click', () => {
    checks.forEach(input => { input.checked = false; });
    updateChecks();
  });
  root.querySelector('#print-kit').addEventListener('click', () => window.print());
  const levels = {
    N5: [[text.vocabulary, 20], [text.grammar, 40], [text.listening, 30]],
    N4: [[text.vocabulary, 25], [text.grammar, 55], [text.listening, 35]],
    N3: [[text.vocabulary, 30], [text.grammar, 70], [text.listening, 40]],
    N2: [[text.combined, 105], [text.listening, 50]],
    N1: [[text.combined, 110], [text.listening, 55]],
  };
  const buttons = [...root.querySelectorAll('[data-level]')];
  updateChecks();
  buttons.forEach(button => button.addEventListener('click', () => {
    const level = button.dataset.level;
    const blocks = levels[level];
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const panel = root.querySelector('#level-details');
    panel.replaceChildren();
    const heading = document.createElement('h3');
    heading.textContent = `${level}: ${blocks.length === 3 ? text.blocks3 : text.blocks2}`;
    const grid = document.createElement('div');
    grid.className = 'ed-time-grid';
    for (const [label, minutes] of blocks) {
      const block = document.createElement('div');
      const title = document.createElement('span');
      title.textContent = label;
      const duration = document.createElement('strong');
      duration.append(String(minutes));
      const unit = document.createElement('small');
      unit.textContent = text.unit;
      duration.append(unit);
      block.append(title, duration);
      grid.append(block);
    }
    const total = document.createElement('p');
    total.className = 'ed-time-total';
    total.textContent = text.total.replace('{minutes}',String(blocks.reduce((sum, item) => sum + item[1], 0)));
    panel.append(heading, grid, total);
  }));
})();
