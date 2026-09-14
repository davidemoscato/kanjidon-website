(() => {
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-card-flip]').forEach((card) => {
    let gesture = null;
    let suppressClick = false;
    const setFlipped = (flipped) => card.setAttribute('aria-pressed', String(flipped));

    card.disabled = false;
    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse' && hover.matches && !reducedMotion.matches) {
        setFlipped(true);
      }
    });
    card.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse' && hover.matches && !reducedMotion.matches) {
        setFlipped(false);
      }
    });

    // Keep native scrolling and zooming. A drag or cancelled touch is not a tap.
    card.addEventListener('pointerdown', (event) => {
      suppressClick = false;
      if (!event.isPrimary || event.button !== 0) return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }, { passive: true });
    card.addEventListener('pointermove', (event) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 10) {
        suppressClick = true;
      }
    }, { passive: true });
    card.addEventListener('pointerup', () => { gesture = null; }, { passive: true });
    card.addEventListener('pointercancel', () => {
      gesture = null;
      suppressClick = true;
    }, { passive: true });
    card.addEventListener('click', (event) => {
      if (event.detail !== 0 && suppressClick) {
        suppressClick = false;
        return;
      }
      setFlipped(card.getAttribute('aria-pressed') !== 'true');
    });
  });
})();
