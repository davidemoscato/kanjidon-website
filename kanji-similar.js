// The quiz runs locally. No answers or scores are stored or transmitted.
(() => {
  'use strict';
  const root = document.querySelector('.kanji-similar');
  const payload = document.getElementById('kanji-quiz-text');
  if (!root || !payload) return;
  const ui = JSON.parse(payload.textContent);
  const questions = [...root.querySelectorAll('[data-quiz="final"]')];
  const progress = root.querySelector('.quiz-progress');
  const result = root.querySelector('.quiz-result');
  const number = new Intl.NumberFormat(document.documentElement.lang || 'en');

  function writeMessage(element, value) {
    // Only the build-validated Japanese marker creates an element. All other
    // content is text, including punctuation supplied by translations.
    element.replaceChildren();
    let offset = 0;
    for (const match of value.matchAll(/<ja>([^<>]+)<\/ja>/g)) {
      element.append(document.createTextNode(value.slice(offset, match.index)));
      const japanese = document.createElement('bdi');
      japanese.lang = 'ja';
      japanese.textContent = match[1];
      element.append(japanese);
      offset = match.index + match[0].length;
    }
    element.append(document.createTextNode(value.slice(offset)));
  }

  function updateProgress() {
    const tried = questions.filter(q => q.dataset.answered === 'true');
    progress.textContent = ui.progress.replace('{done}', number.format(tried.length)).replace('{total}', number.format(questions.length));
    if (tried.length !== questions.length) return;
    const correct = tried.filter(q => q.dataset.correctAnswer === 'true').length;
    result.hidden = false;
    writeMessage(result.querySelector('[role="status"]'), ui.results[correct]);
  }

  for (const comparison of root.querySelectorAll('[data-pair]')) {
    const button = comparison.querySelector('.reveal-detail');
    button.addEventListener('click', () => {
      const active = comparison.classList.toggle('is-highlighted');
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? ui.detailOff : ui.detailOn;
    });
    button.hidden = false;
  }

  for (const question of root.querySelectorAll('[data-quiz]')) {
    const options = question.querySelector('.quiz-options');
    const buttons = [...options.querySelectorAll('button')];
    for (const button of buttons) {
      button.addEventListener('click', () => {
        if (question.dataset.answered === 'true') return;
        const correct = button.dataset.choice === question.dataset.answer;
        question.dataset.answered = 'true';
        question.dataset.correctAnswer = String(correct);
        for (const option of buttons) {
          option.setAttribute('aria-disabled', 'true');
          const answer = option.dataset.choice === question.dataset.answer;
          const selected = option === button;
          option.classList.toggle('is-correct', answer);
          option.classList.toggle('is-wrong', selected && !correct);
          if (answer || selected) {
            const marker = document.createElement('span');
            marker.className = 'choice-marker';
            marker.textContent = answer ? (selected ? ui.correct : ui.answer) : ui.chosen;
            option.append(marker);
          }
        }
        writeMessage(question.querySelector('.quiz-feedback'), correct ? question.dataset.correct : question.dataset.wrong);
        if (question.dataset.quiz === 'hero') {
          writeMessage(root.querySelector('[data-dodon-reaction]'), correct ? ui.reactionGood : ui.reactionBad);
          root.querySelector('.dodon-bubble>span').textContent = correct ? ui.reactionGoodNote : ui.reactionBadNote;
        } else updateProgress();
      });
    }
    options.hidden = false;
    question.querySelector('.quiz-fallback').hidden = true;
  }

  root.querySelector('.reset-quiz').addEventListener('click', () => {
    for (const question of questions) {
      delete question.dataset.answered;
      delete question.dataset.correctAnswer;
      question.querySelector('.quiz-feedback').textContent = '';
      for (const button of question.querySelectorAll('[data-choice]')) {
        button.removeAttribute('aria-disabled');
        button.classList.remove('is-correct', 'is-wrong');
        button.querySelector('.choice-marker')?.remove();
      }
    }
    result.hidden = true;
    updateProgress();
    questions[0].querySelector('[data-choice]').focus();
  });
  updateProgress();
  progress.hidden = false;
})();
