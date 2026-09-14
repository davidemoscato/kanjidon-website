/**
 * Footer Component - UN SOLO FILE per tutto il sito
 * Modifica qui = aggiorna ovunque
 */

function renderFooter(currentLang = 'en') {
    const LANGUAGES = [
        { code: 'it', folder: '/it/', flag: '🇮🇹', name: 'Italiano' },
        { code: 'en', folder: '/', flag: '🇬🇧', name: 'English' },
        { code: 'fr', folder: '/fr/', flag: '🇫🇷', name: 'Français' },
        { code: 'es', folder: '/es/', flag: '🇪🇸', name: 'Español' },
        { code: 'de', folder: '/de/', flag: '🇩🇪', name: 'Deutsch' },
        { code: 'pt', folder: '/pt/', flag: '🇵🇹', name: 'Português' },
        { code: 'ru', folder: '/ru/', flag: '🇷🇺', name: 'Русский' },
        { code: 'ko', folder: '/ko/', flag: '🇰🇷', name: '한국어' },
        { code: 'zh', folder: '/zh/', flag: '🇨🇳', name: '中文' },
        { code: 'zh-tw', folder: '/zh-tw/', flag: '🇹🇼', name: '繁體中文' },
        { code: 'ar', folder: '/ar/', flag: '🇸🇦', name: 'العربية' },
        { code: 'hi', folder: '/hi/', flag: '🇮🇳', name: 'हिन्दी' },
        { code: 'th', folder: '/th/', flag: '🇹🇭', name: 'ไทย' },
        { code: 'vi', folder: '/vi/', flag: '🇻🇳', name: 'Tiếng Việt' },
        { code: 'id', folder: '/id/', flag: '🇮🇩', name: 'Bahasa Indonesia' },
        { code: 'ms', folder: '/ms/', flag: '🇲🇾', name: 'Bahasa Melayu' },
        { code: 'tr', folder: '/tr/', flag: '🇹🇷', name: 'Türkçe' },
        { code: 'pl', folder: '/pl/', flag: '🇵🇱', name: 'Polski' },
        { code: 'fa', folder: '/fa/', flag: '🇮🇷', name: 'فارسی' },
        { code: 'fil', folder: '/fil/', flag: '🇵🇭', name: 'Filipino' }
    ];

    const current = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[1];

    const languageOptions = LANGUAGES.map(lang => {
        const isActive = lang.code === currentLang ? ' active' : '';
        return `<a href="${lang.folder}" class="language-option${isActive}">
            <span class="flag-icon">${lang.flag}</span> ${lang.name}
        </a>`;
    }).join('\n');

    return `
    <footer class="footer">
        <div class="container footer-content">
            <div class="footer-brand">
                <img src="/assets/images/kanjidon-app-icon.png" alt="Kanjidon" class="footer-logo">
                <p>Collect Cards. Remember Kanji.</p>
            </div>
            <div class="footer-links">
                <div class="footer-col">
                    <h4>Resources</h4>
                    <a href="/blog/">Blog</a>
                    <a href="/faq/">FAQ</a>
                </div>
                <div class="footer-col">
                    <h4>Legal</h4>
                    <a href="/privacy.html">Privacy Policy</a>
                    <a href="/terms.html">Terms of Service</a>
                    <a href="/delete.html">Delete Account</a>
                </div>
                <div class="footer-col">
                    <h4>Support</h4>
                    <a href="/about.html">About Us</a>
                    <a href="/support.html">Help Center</a>
                    <a href="mailto:info@kanjidon.com">info@kanjidon.com</a>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="footer-legal">
                    <p><strong>Kanjidon Team</strong></p>
                    <p>VAT: IT01691020083</p>
                </div>
                <div class="language-selector">
                    <button class="language-btn" aria-label="Change language">
                        <span class="flag-icon">${current.flag}</span>
                        <span class="language-name">${current.name}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>
                    <div class="language-dropdown">
                        ${languageOptions}
                    </div>
                </div>
                <p class="footer-copy">&copy; 2026 Kanjidon. All rights reserved.</p>
            </div>
        </div>
    </footer>`;
}

// Auto-inject footer
document.addEventListener('DOMContentLoaded', function() {
    // Detect current language from URL
    const path = window.location.pathname;
    let lang = 'en';

    const langMatch = path.match(/^\/(it|fr|es|de|pt|ru|ko|zh|zh-tw|ar|hi|th|vi|id|ms|tr|pl|fa|fil)\//);
    if (langMatch) {
        lang = langMatch[1];
    }

    // Find footer placeholder or append to body
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.outerHTML = renderFooter(lang);
    } else {
        // Append before closing body if no placeholder
        document.body.insertAdjacentHTML('beforeend', renderFooter(lang));
    }

    // Language selector toggle
    const languageBtn = document.querySelector('.language-btn');
    const languageDropdown = document.querySelector('.language-dropdown');

    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function() {
            languageDropdown.classList.remove('show');
        });
    }
});
