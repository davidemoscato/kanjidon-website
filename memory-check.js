const QUESTION_COUNT = 12;
const OPTION_COUNT = 4;

export function normalizeMeaning(value) {
  return String(value).normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function hashSeed(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return function random() {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(values, random) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function createMemoryQuestions({ bank, questionKanji, seed }) {
  if (!Array.isArray(bank) || bank.length < QUESTION_COUNT) throw new TypeError("Invalid quiz data");
  const random = seededRandom(hashSeed(seed));
  let questionItems;
  if (questionKanji === undefined) {
    questionItems = shuffled(bank, random).slice(0, QUESTION_COUNT);
  } else {
    if (!Array.isArray(questionKanji) || questionKanji.length !== QUESTION_COUNT) {
      throw new Error(`Expected ${QUESTION_COUNT} questions`);
    }
    const byKanji = new Map(bank.map((item) => [item.kanji, item]));
    questionItems = questionKanji.map((kanji) => byKanji.get(kanji));
    if (questionItems.some((item) => !item)) throw new Error("Question data is incomplete");
  }

  return shuffled(questionItems, random).map((item) => {
    const usedMeanings = new Set([normalizeMeaning(item.meaning)]);
    const distractors = [];
    for (const candidate of shuffled(bank, random)) {
      const normalized = normalizeMeaning(candidate.meaning);
      if (candidate.kanji === item.kanji || !normalized || usedMeanings.has(normalized)) continue;
      usedMeanings.add(normalized);
      distractors.push(candidate.meaning);
      if (distractors.length === OPTION_COUNT - 1) break;
    }
    if (distractors.length !== OPTION_COUNT - 1) throw new Error(`Not enough distinct answers for ${item.kanji}`);
    return {
      ...item,
      options: shuffled([item.meaning, ...distractors], random),
    };
  });
}

function dailyChallengeCode(date = new Date()) {
  const day = date.toISOString().slice(0, 10);
  return hashSeed(day).toString(36).toUpperCase().padStart(6, "0").slice(-6);
}

function challengeCode() {
  const match = window.location.hash.match(/^#challenge=([A-Z0-9]{6})$/);
  return match ? match[1] : dailyChallengeCode();
}

function readPageData() {
  const element = document.getElementById("memory-check-data");
  if (!element) throw new Error("Missing memory-check data");
  const data = JSON.parse(element.textContent);
  if (
    !data
    || data.version !== 2
    || !Array.isArray(data.bank)
    || !data.labels
    || typeof data.shareUrl !== "string"
  ) {
    throw new Error("Invalid memory-check data");
  }
  return data;
}

function startMemoryCheck() {
  const data = readPageData();
  const activeChallenge = challengeCode();
  for (const link of document.querySelectorAll(".memory-check-language-list a")) {
    const localizedChallenge = new URL(link.href);
    localizedChallenge.hash = `challenge=${activeChallenge}`;
    link.href = localizedChallenge.href;
  }
  const questions = createMemoryQuestions({
    bank: data.bank,
    seed: activeChallenge,
  });
  const elements = {
    startPanel: document.getElementById("memory-check-start"),
    startButton: document.getElementById("memory-check-start-button"),
    quizPanel: document.getElementById("memory-check-quiz"),
    questionNumber: document.getElementById("memory-check-number"),
    question: document.getElementById("memory-check-question"),
    answers: document.getElementById("memory-check-answers"),
    feedback: document.getElementById("memory-check-feedback"),
    reading: document.getElementById("memory-check-reading"),
    nextButton: document.getElementById("memory-check-next"),
    resultPanel: document.getElementById("memory-check-result"),
    correct: document.getElementById("memory-check-correct"),
    wrong: document.getElementById("memory-check-wrong"),
    retryButton: document.getElementById("memory-check-retry"),
    shareButton: document.getElementById("memory-check-share"),
    shareStatus: document.getElementById("memory-check-share-status"),
  };
  if (Object.values(elements).some((element) => !element)) throw new Error("Memory-check interface is incomplete");

  let index = 0;
  let correctCount = 0;
  let answered = false;

  function showQuestion() {
    const current = questions[index];
    answered = false;
    elements.questionNumber.textContent = `${data.labels.question} ${index + 1}/${questions.length}`;
    elements.question.textContent = current.kanji;
    elements.feedback.textContent = "";
    elements.reading.textContent = "";
    elements.nextButton.hidden = true;
    elements.answers.replaceChildren();

    current.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-check-answer";
      button.textContent = option;
      button.setAttribute("aria-label", `${data.labels.answer} ${optionIndex + 1}: ${option}`);
      button.addEventListener("click", () => selectAnswer(button, option));
      elements.answers.append(button);
    });
    elements.question.focus();
  }

  function selectAnswer(selectedButton, selectedMeaning) {
    if (answered) return;
    answered = true;
    const current = questions[index];
    const isCorrect = normalizeMeaning(selectedMeaning) === normalizeMeaning(current.meaning);
    if (isCorrect) correctCount += 1;

    for (const button of elements.answers.querySelectorAll("button")) {
      button.disabled = true;
      const optionIsCorrect = normalizeMeaning(button.textContent) === normalizeMeaning(current.meaning);
      if (optionIsCorrect) button.classList.add("is-correct");
      if (button === selectedButton && !isCorrect) button.classList.add("is-wrong");
    }
    elements.feedback.textContent = isCorrect
      ? data.labels.correct
      : `${data.labels.wrong} · ${data.labels.answer}: ${current.meaning}`;
    elements.feedback.className = `memory-check-feedback ${isCorrect ? "is-correct" : "is-wrong"}`;
    elements.reading.textContent = current.reading;
    elements.nextButton.hidden = false;
    elements.nextButton.focus();
  }

  function showResult() {
    elements.quizPanel.hidden = true;
    elements.resultPanel.hidden = false;
    elements.correct.textContent = `${data.labels.correct}: ${correctCount}`;
    elements.wrong.textContent = `${data.labels.wrong}: ${questions.length - correctCount}`;
    elements.resultPanel.focus();
  }

  function begin() {
    index = 0;
    correctCount = 0;
    answered = false;
    elements.shareStatus.textContent = "";
    elements.startPanel.hidden = true;
    elements.resultPanel.hidden = true;
    elements.quizPanel.hidden = false;
    showQuestion();
  }

  elements.startButton.addEventListener("click", begin);
  elements.nextButton.addEventListener("click", () => {
    if (!answered) return;
    if (index + 1 >= questions.length) {
      showResult();
      return;
    }
    index += 1;
    showQuestion();
  });
  elements.retryButton.addEventListener("click", begin);
  elements.shareButton.addEventListener("click", async () => {
    const url = new URL(data.shareUrl);
    url.hash = `challenge=${activeChallenge}`;
    elements.shareStatus.textContent = "";
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: url.href });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url.href);
        elements.shareStatus.textContent = data.labels.copied;
      } else {
        elements.shareStatus.textContent = url.href;
      }
    } catch (error) {
      if (error?.name !== "AbortError") elements.shareStatus.textContent = url.href;
    }
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startMemoryCheck, { once: true });
  else startMemoryCheck();
}
