/**
 * Kanjidon adaptive theme
 * Generated from the app ARB localizations by scripts/generate-website-theme.js.
 */
(function () {
    "use strict";

    var STORAGE_KEY = "kanjidon-theme";
    var VALID_PREFERENCES = ["system", "light", "dark"];
    var labelsByLanguage = {
    "en": {
        "theme": "Theme",
        "system": "System",
        "light": "Light",
        "dark": "Dark"
    },
    "it": {
        "theme": "Tema",
        "system": "Sistema",
        "light": "Chiaro",
        "dark": "Scuro"
    },
    "fr": {
        "theme": "Thème",
        "system": "Système",
        "light": "Clair",
        "dark": "Sombre"
    },
    "es": {
        "theme": "Tema",
        "system": "Sistema",
        "light": "Claro",
        "dark": "Oscuro"
    },
    "de": {
        "theme": "Design",
        "system": "System",
        "light": "Hell",
        "dark": "Dunkel"
    },
    "pt": {
        "theme": "Tema",
        "system": "Sistema",
        "light": "Claro",
        "dark": "Escuro"
    },
    "ru": {
        "theme": "Тема",
        "system": "Системная",
        "light": "Светлая",
        "dark": "Тёмная"
    },
    "ko": {
        "theme": "테마",
        "system": "시스템",
        "light": "밝음",
        "dark": "어두움"
    },
    "zh": {
        "theme": "主题",
        "system": "系统",
        "light": "浅色",
        "dark": "深色"
    },
    "zh-tw": {
        "theme": "主題",
        "system": "系統",
        "light": "淺色",
        "dark": "深色"
    },
    "ar": {
        "theme": "المظهر",
        "system": "النظام",
        "light": "فاتح",
        "dark": "داكن"
    },
    "hi": {
        "theme": "थीम",
        "system": "सिस्टम",
        "light": "लाइट",
        "dark": "डार्क"
    },
    "th": {
        "theme": "ธีม",
        "system": "ระบบ",
        "light": "สว่าง",
        "dark": "มืด"
    },
    "vi": {
        "theme": "Chủ đề",
        "system": "Hệ thống",
        "light": "Sáng",
        "dark": "Tối"
    },
    "id": {
        "theme": "Tema",
        "system": "Sistem",
        "light": "Terang",
        "dark": "Gelap"
    },
    "ms": {
        "theme": "Tema",
        "system": "Sistem",
        "light": "Terang",
        "dark": "Gelap"
    },
    "tr": {
        "theme": "Tema",
        "system": "Sistem",
        "light": "Açık",
        "dark": "Koyu"
    },
    "pl": {
        "theme": "Motyw",
        "system": "Systemowy",
        "light": "Jasny",
        "dark": "Ciemny"
    },
    "fa": {
        "theme": "پوسته",
        "system": "سیستم",
        "light": "روشن",
        "dark": "تاریک"
    },
    "fil": {
        "theme": "Tema",
        "system": "Sistema",
        "light": "Maliwanag",
        "dark": "Madilim"
    },
    "mn": {
        "theme": "Загвар",
        "system": "Системийнх",
        "light": "Гэрэлтэй",
        "dark": "Харанхуй"
    },
    "ro": {
        "theme": "Temă",
        "system": "Sistem",
        "light": "Luminoasă",
        "dark": "Întunecată"
    },
    "bg": {
        "theme": "Тема",
        "system": "Система",
        "light": "Светла",
        "dark": "Тъмна"
    },
    "ne": {
        "theme": "थिम",
        "system": "सिस्टम",
        "light": "उज्यालो",
        "dark": "अँध्यारो"
    },
    "my": {
        "theme": "သီးမ်",
        "system": "စနစ်",
        "light": "အလင်း",
        "dark": "အမှောင်"
    },
    "bn": {
        "theme": "থিম",
        "system": "সিস্টেম",
        "light": "লাইট",
        "dark": "ডার্ক"
    },
    "uk": {
        "theme": "Тема",
        "system": "Системная",
        "light": "Светлая",
        "dark": "Темная"
    },
    "uz": {
        "theme": "Mavzu",
        "system": "Tizim",
        "light": "Yorug‘",
        "dark": "Qorong‘i"
    },
    "si": {
        "theme": "තේමාව",
        "system": "පද්ධතිය",
        "light": "ආලෝක",
        "dark": "අඳුරු"
    },
    "ta": {
        "theme": "தீம்",
        "system": "சிஸ்டம்",
        "light": "ஒளி",
        "dark": "இருள்"
    },
    "ur": {
        "theme": "تھیم",
        "system": "سسٹم",
        "light": "لائٹ",
        "dark": "ڈارک"
    },
    "hu": {
        "theme": "Téma",
        "system": "Rendszer",
        "light": "Világos",
        "dark": "Sötét"
    },
    "he": {
        "theme": "ערכת נושא",
        "system": "מערכת",
        "light": "בהירה",
        "dark": "כהה"
    },
    "km": {
        "theme": "រូបរាង",
        "system": "តាមប្រព័ន្ធ",
        "light": "ភ្លឺ",
        "dark": "ងងឹត"
    },
    "kn": {
        "theme": "ಥೀಮ್",
        "system": "ಸಿಸ್ಟಮ್",
        "light": "ಬೆಳಕು",
        "dark": "ಥೀಮ್"
    },
    "mr": {
        "theme": "Theme रूप",
        "system": "System प्रणाली",
        "light": "Light उजळ",
        "dark": "Dark गडद"
    },
    "te": {
        "theme": "Theme థీమ్",
        "system": "System సిస్టమ్",
        "light": "Light వెలుగు",
        "dark": "Dark చీకటి"
    },
    "nl": {
        "theme": "Thema",
        "system": "Systeem",
        "light": "Licht",
        "dark": "Donker"
    },
    "fi": {
        "theme": "Teema",
        "system": "Järjestelmä",
        "light": "Vaalea",
        "dark": "Tumma"
    },
    "cs": {
        "theme": "Motiv",
        "system": "Systémový",
        "light": "Světlý",
        "dark": "Tmavý"
    }
};
    var systemDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var preference = readPreference();

    function readPreference() {
        try {
            var stored = window.localStorage.getItem(STORAGE_KEY);
            return VALID_PREFERENCES.indexOf(stored) !== -1 ? stored : "system";
        } catch (_) {
            return "system";
        }
    }

    function writePreference(value) {
        try {
            window.localStorage.setItem(STORAGE_KEY, value);
        } catch (_) {
            // The theme remains active for this page when storage is unavailable.
        }
    }

    function effectiveTheme(value) {
        return value === "system"
            ? (systemDarkQuery.matches ? "dark" : "light")
            : value;
    }

    function updateThemeColor(value) {
        var meta = document.querySelector(
            'meta[name="theme-color"][data-kanjidon-theme]'
        );
        if (meta) {
            meta.content = value === "dark" ? "#1C1C1E" : "#FAF9F6";
        }
    }

    function applyTheme(value, persist) {
        preference = VALID_PREFERENCES.indexOf(value) !== -1
            ? value
            : "system";

        var resolved = effectiveTheme(preference);
        var root = document.documentElement;
        root.dataset.theme = resolved;
        root.dataset.themePreference = preference;
        root.style.colorScheme = resolved;
        updateThemeColor(resolved);

        if (persist) {
            writePreference(preference);
        }

        updateControls();
    }

    function currentLabels() {
        var language = (document.documentElement.lang || "en")
            .toLowerCase()
            .replace("_", "-");
        return labelsByLanguage[language]
            || labelsByLanguage[language.split("-")[0]]
            || labelsByLanguage.en;
    }

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[character];
        });
    }

    function icon(name) {
        if (name === "light") {
            return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path></svg>';
        }
        if (name === "dark") {
            return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.4A8.5 8.5 0 0 1 9.6 3.5 8.5 8.5 0 1 0 20.5 14.4Z"></path></svg>';
        }
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path></svg>';
    }

    function updateControls() {
        var picker = document.querySelector("[data-theme-picker]");
        if (!picker) {
            return;
        }

        var labels = currentLabels();
        var toggle = picker.querySelector("[data-theme-toggle]");
        var selectedLabel = labels[preference];
        toggle.innerHTML = icon(preference);
        toggle.setAttribute("aria-label", labels.theme + ": " + selectedLabel);
        toggle.title = labels.theme + ": " + selectedLabel;

        picker.querySelectorAll("[data-theme-choice]").forEach(function (choice) {
            var selected = choice.dataset.themeChoice === preference;
            choice.setAttribute("aria-checked", String(selected));
            choice.classList.toggle("active", selected);
        });
    }

    function closeMenu(picker, restoreFocus) {
        var toggle = picker.querySelector("[data-theme-toggle]");
        var menu = picker.querySelector("[data-theme-menu]");
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        if (restoreFocus) {
            toggle.focus();
        }
    }

    function openMenu(picker) {
        var toggle = picker.querySelector("[data-theme-toggle]");
        var menu = picker.querySelector("[data-theme-menu]");
        menu.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        var selected = menu.querySelector('[aria-checked="true"]');
        (selected || menu.querySelector("button")).focus();
    }

    function installPicker() {
        var nav = document.querySelector(".nav-links");
        if (!nav || nav.querySelector("[data-theme-picker]")) {
            return;
        }

        var labels = currentLabels();
        var picker = document.createElement("div");
        picker.className = "theme-picker";
        picker.dataset.themePicker = "";
        picker.innerHTML =
            '<button type="button" class="theme-toggle" data-theme-toggle aria-haspopup="menu" aria-expanded="false"></button>'
            + '<div class="theme-menu" data-theme-menu role="menu" hidden>'
            + '<button type="button" class="theme-option" role="menuitemradio" data-theme-choice="system">'
            + icon("system") + '<span>' + escapeHtml(labels.system) + '</span></button>'
            + '<button type="button" class="theme-option" role="menuitemradio" data-theme-choice="light">'
            + icon("light") + '<span>' + escapeHtml(labels.light) + '</span></button>'
            + '<button type="button" class="theme-option" role="menuitemradio" data-theme-choice="dark">'
            + icon("dark") + '<span>' + escapeHtml(labels.dark) + '</span></button>'
            + '</div>';

        var primaryAction = nav.querySelector(".btn");
        nav.insertBefore(picker, primaryAction || nav.firstChild);

        var toggle = picker.querySelector("[data-theme-toggle]");
        var menu = picker.querySelector("[data-theme-menu]");
        var choices = Array.from(
            picker.querySelectorAll("[data-theme-choice]")
        );

        toggle.addEventListener("click", function () {
            if (menu.hidden) {
                openMenu(picker);
            } else {
                closeMenu(picker, false);
            }
        });

        choices.forEach(function (choice) {
            choice.addEventListener("click", function () {
                applyTheme(choice.dataset.themeChoice, true);
                closeMenu(picker, true);
            });
        });

        picker.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu(picker, true);
                return;
            }

            if (menu.hidden || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                return;
            }

            event.preventDefault();
            var currentIndex = choices.indexOf(document.activeElement);
            var nextIndex;

            if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = choices.length - 1;
            } else {
                var direction = event.key === "ArrowDown" ? 1 : -1;
                nextIndex = (currentIndex + direction + choices.length)
                    % choices.length;
            }

            choices[nextIndex].focus();
        });

        picker.addEventListener("focusout", function (event) {
            if (!picker.contains(event.relatedTarget)) {
                closeMenu(picker, false);
            }
        });

        document.addEventListener("click", function (event) {
            if (!picker.contains(event.target)) {
                closeMenu(picker, false);
            }
        });

        updateControls();
    }

    applyTheme(preference, false);

    var onSystemThemeChange = function () {
        if (preference === "system") {
            applyTheme("system", false);
        }
    };
    if (typeof systemDarkQuery.addEventListener === "function") {
        systemDarkQuery.addEventListener("change", onSystemThemeChange);
    } else if (typeof systemDarkQuery.addListener === "function") {
        systemDarkQuery.addListener(onSystemThemeChange);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", installPicker);
    } else {
        installPicker();
    }
})();
