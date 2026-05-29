/* Soft language suggestion banner (best practice: no redirect, browser-language based).
   Shows a dismissible banner ONLY if the visitor's browser language has a Kanjidon
   version and differs from the current page. Remembers the choice. SEO-safe (no redirect,
   crawlers unaffected). Shared across all language homes. */
(function () {
  "use strict";
  var L = {
    "en":    { path: "/",        msg: "Kanjidon is available in English.",            cta: "Continue in English",            close: "Close" },
    "it":    { path: "/it/",     msg: "Kanjidon è disponibile in italiano.",          cta: "Continua in italiano",           close: "Chiudi" },
    "fr":    { path: "/fr/",     msg: "Kanjidon est disponible en français.",         cta: "Continuer en français",          close: "Fermer" },
    "es":    { path: "/es/",     msg: "Kanjidon está disponible en español.",         cta: "Continuar en español",           close: "Cerrar" },
    "de":    { path: "/de/",     msg: "Kanjidon ist auf Deutsch verfügbar.",          cta: "Auf Deutsch fortfahren",         close: "Schließen" },
    "pt":    { path: "/pt/",     msg: "O Kanjidon está disponível em português.",     cta: "Continuar em português",         close: "Fechar" },
    "ru":    { path: "/ru/",     msg: "Kanjidon доступен на русском.",                cta: "Продолжить на русском",          close: "Закрыть" },
    "ko":    { path: "/ko/",     msg: "Kanjidon은 한국어로 이용할 수 있습니다.",          cta: "한국어로 계속하기",                 close: "닫기" },
    "zh":    { path: "/zh/",     msg: "Kanjidon 提供中文版本。",                       cta: "继续浏览中文版",                   close: "关闭" },
    "zh-tw": { path: "/zh-tw/",  msg: "Kanjidon 提供繁體中文版本。",                   cta: "繼續瀏覽繁體中文版",               close: "關閉" },
    "ar":    { path: "/ar/",     msg: "Kanjidon متوفّر بالعربية.",                    cta: "المتابعة بالعربية",              close: "إغلاق", rtl: true },
    "fa":    { path: "/fa/",     msg: "Kanjidon به فارسی در دسترس است.",              cta: "ادامه به فارسی",                 close: "بستن", rtl: true },
    "hi":    { path: "/hi/",     msg: "Kanjidon हिन्दी में उपलब्ध है।",                 cta: "हिन्दी में जारी रखें",              close: "बंद करें" },
    "th":    { path: "/th/",     msg: "Kanjidon มีให้บริการเป็นภาษาไทย",              cta: "ใช้งานต่อเป็นภาษาไทย",            close: "ปิด" },
    "vi":    { path: "/vi/",     msg: "Kanjidon có sẵn bằng tiếng Việt.",            cta: "Tiếp tục bằng tiếng Việt",       close: "Đóng" },
    "id":    { path: "/id/",     msg: "Kanjidon tersedia dalam Bahasa Indonesia.",   cta: "Lanjutkan dalam Bahasa Indonesia", close: "Tutup" },
    "ms":    { path: "/ms/",     msg: "Kanjidon tersedia dalam Bahasa Melayu.",      cta: "Teruskan dalam Bahasa Melayu",   close: "Tutup" },
    "tr":    { path: "/tr/",     msg: "Kanjidon Türkçe olarak mevcut.",              cta: "Türkçe devam edin",              close: "Kapat" },
    "pl":    { path: "/pl/",     msg: "Kanjidon jest dostępny po polsku.",           cta: "Kontynuuj po polsku",            close: "Zamknij" },
    "fil":   { path: "/fil/",    msg: "Available ang Kanjidon sa Filipino.",         cta: "Magpatuloy sa Filipino",         close: "Isara" }
  };

  function norm(s) {
    s = (s || "").toLowerCase();
    if (s.indexOf("zh") === 0) {
      if (/(tw|hant|hk|mo)/.test(s)) return "zh-tw";
      return "zh";
    }
    if (s.indexOf("tl") === 0 || s.indexOf("fil") === 0) return "fil";
    return s.split("-")[0];
  }

  function detect() {
    var langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < langs.length; i++) {
      var c = norm(langs[i]);
      if (L[c]) return c;
    }
    return null;
  }

  try { if (localStorage.getItem("kanjidonLangSuggest") === "done") return; } catch (e) {}

  var current = norm(document.documentElement.getAttribute("lang") || "en");
  var target = detect();
  if (!target || target === current || !L[target]) return;

  var t = L[target];
  var arrow = t.rtl ? " ←" : " →";

  var bar = document.createElement("div");
  bar.className = "lang-suggest";
  bar.setAttribute("role", "region");
  if (t.rtl) bar.setAttribute("dir", "rtl");

  var p = document.createElement("p");
  p.appendChild(document.createTextNode(t.msg + " "));
  var a = document.createElement("a");
  a.className = "lang-suggest-cta";
  a.href = t.path;
  a.textContent = t.cta + arrow;
  p.appendChild(a);

  var btn = document.createElement("button");
  btn.className = "lang-suggest-close";
  btn.setAttribute("aria-label", t.close);
  btn.textContent = "✕";

  bar.appendChild(p);
  bar.appendChild(btn);

  function done() { try { localStorage.setItem("kanjidonLangSuggest", "done"); } catch (e) {} }
  btn.addEventListener("click", function () {
    bar.classList.remove("visible");
    done();
    setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 200);
  });
  a.addEventListener("click", done);

  document.body.appendChild(bar);
  requestAnimationFrame(function () { bar.classList.add("visible"); });
})();
