/* Local editorial interactions. No network requests, tracking or saved answers. */
(() => {
  'use strict';
  const setup = () => {
    const runtime = JSON.parse(document.getElementById('v-runtime').textContent);
    const normalizeAnswer = value => value.toLocaleLowerCase(runtime.lang).normalize('NFD').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
    const acceptedAnswers = new Set(runtime.answers.map(normalizeAnswer));
    const study = document.getElementById('recall-study');
    const form = document.getElementById('recall-form');
    const result = document.getElementById('recall-result');
    const answer = document.getElementById('recall-answer');
    const hide = document.getElementById('recall-hide');
    const verdict = document.getElementById('recall-verdict');
    const feedback = document.getElementById('recall-feedback');
    const reset = document.getElementById('recall-reset');
    hide.hidden = false;
    hide.addEventListener('click', () => {
      study.hidden = true;
      result.hidden = true;
      form.hidden = false;
      answer.value = '';
      answer.focus({preventScroll:true});
    });
    const showResult = (kind) => {
      const responses = runtime.responses;
      const [title, explanation] = responses[kind];
      form.hidden = true;
      result.hidden = false;
      verdict.textContent = title;
      feedback.textContent = explanation;
      verdict.tabIndex = -1;
      verdict.focus({preventScroll:true});
    };
    form.addEventListener('submit', event => {
      event.preventDefault();
      const normalized = normalizeAnswer(answer.value);
      showResult(acceptedAnswers.has(normalized) ? 'recalled' : 'different');
    });
    document.getElementById('recall-reveal').addEventListener('click', () => showResult('revealed'));
    reset.addEventListener('click', () => {
      form.hidden = true;
      result.hidden = true;
      study.hidden = false;
      hide.focus({preventScroll:true});
    });
    const gallery = document.getElementById('card-gallery');
    const packButton = document.getElementById('pack-open');
    const status = document.getElementById('pack-status');
    let opened = false;
    gallery.hidden = true;
    packButton.hidden = false;
    packButton.setAttribute('aria-controls','card-gallery');
    packButton.setAttribute('aria-expanded','false');
    packButton.addEventListener('click', () => {
      opened = !opened;
      gallery.hidden = !opened;
      document.getElementById('le-carte').classList.toggle('is-open', opened);
      packButton.setAttribute('aria-expanded', String(opened));
      packButton.textContent = opened ? runtime.packClose : runtime.packOpen;
      status.textContent = opened ? runtime.packStatus : '';
    });
  };
  if (document.readyState === 'complete') setup();
  else document.addEventListener('DOMContentLoaded',setup);
})();
