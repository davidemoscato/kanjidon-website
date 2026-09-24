(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const pack = document.querySelector('[data-pack-preview]');
  if (pack) {
    let gesture;
    let dragged = false;
    let pinned = false;
    const open = value => pack.setAttribute('aria-pressed', String(value));
    pack.disabled = false;
    pack.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && hover.matches && !reduced.matches) open(true);
    });
    pack.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse') open(pinned);
    });
    pack.addEventListener('pointerdown', event => {
      dragged = false;
      if (event.isPrimary && event.button === 0) gesture = { x: event.clientX, y: event.clientY };
    }, { passive: true });
    pack.addEventListener('pointermove', event => {
      if (gesture && Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 10) dragged = true;
    }, { passive: true });
    pack.addEventListener('pointerup', () => { gesture = null; }, { passive: true });
    pack.addEventListener('pointercancel', () => { gesture = null; dragged = true; }, { passive: true });
    pack.addEventListener('click', event => {
      if (event.detail && dragged) return;
      pinned = !pinned;
      open(pinned);
    });
    pack.addEventListener('keydown', event => {
      if (event.key === 'Escape') { pinned = false; open(false); }
    });
  }

  const fan = document.querySelector('.pack-fan');
  if (fan && !reduced.matches && 'IntersectionObserver' in window) {
    fan.classList.add('is-stacked');
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        fan.classList.remove('is-stacked');
        observer.disconnect();
      }
    }, { threshold: .35 });
    observer.observe(fan);
    reduced.addEventListener('change', () => {
      if (reduced.matches) { fan.classList.remove('is-stacked'); observer.disconnect(); }
    });
  }

  // Two identical, viewport-filling groups prevent empty ends on wide screens.
  document.querySelectorAll('.river-row').forEach(row => {
    const words = [...row.children];
    const group = document.createElement('div');
    group.className = 'river-group';
    group.append(...words);
    row.replaceChildren(group);
    row.classList.add('river-loop');
    const fill = () => {
      row.querySelectorAll('[data-river-copy]').forEach(copy => copy.remove());
      while (group.scrollWidth < document.documentElement.clientWidth * 1.1) {
        words.forEach(word => {
          const copy = word.cloneNode(true);
          copy.setAttribute('aria-hidden', 'true');
          copy.dataset.riverCopy = '';
          group.append(copy);
        });
      }
      const duplicate = group.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.dataset.riverCopy = '';
      row.append(duplicate);
    };
    const observer = new ResizeObserver(fill);
    observer.observe(document.documentElement);
    document.fonts.ready.then(fill);
    fill();
  });
})();
