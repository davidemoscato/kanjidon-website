/* Aggregate website measurement. No visitor/session IDs, cookies, text or query parameters. */
(function () {
    'use strict';
    if (window.kanjidonWebsiteAnalyticsLoaded) return;
    window.kanjidonWebsiteAnalyticsLoaded = true;
    var preference = 'kanjidon_website_analytics_disabled';
    var params = new URLSearchParams(location.search);
    try {
        if (params.get('analytics') === 'off') localStorage.setItem(preference, '1');
        if (params.get('analytics') === 'on') localStorage.removeItem(preference);
    } catch (_) {}
    function excluded() {
        var disabled = false;
        try { disabled = localStorage.getItem(preference) === '1'; } catch (_) {}
        return location.hostname !== 'kanjidon.com' || disabled || params.has('analytics')
            || params.has('rev') || navigator.globalPrivacyControl === true
            || navigator.doNotTrack === '1' || navigator.webdriver === true
            || /bot|spider|crawler|headless|KanjidonEditorialQA/i.test(navigator.userAgent || '');
    }
    if (excluded()) return;
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical || /noindex/i.test((document.querySelector('meta[name="robots"]') || {}).content || '')) return;
    var path = new URL(canonical.href).pathname;
    var article = document.querySelector('.article-content, .article-body, .radio-page article, article.blog-article');
    var isArticle = /\/blog\/[^/]+\/$/.test(path);
    if (!isArticle) article = null;
    var sent = new Set();
    var active = 0;
    var lastTick = performance.now();
    var lastInteraction = lastTick;
    var started = false;
    var maxDepth = 0;
    function cleanPath(value) {
        try { var url = new URL(value, location.href); return url.origin === location.origin ? url.pathname : ''; }
        catch (_) { return ''; }
    }
    function source() {
        if (!document.referrer) return 'direct';
        try {
            var host = new URL(document.referrer).hostname;
            if (host === location.hostname) return 'internal';
            if (/(^|\.)(google\.[a-z.]+|bing.com|duckduckgo.com|search.yahoo.com)$/.test(host)) return 'search';
            if (/(^|\.)(reddit.com|instagram.com|facebook.com|t.co|x.com|youtube.com|tiktok.com)$/.test(host)) return 'social';
            return 'referral';
        } catch (_) { return 'direct'; }
    }
    function emit(event, target) {
        if (excluded() || !started) return;
        var key = event + ':' + (target || '');
        if (sent.has(key) || sent.size >= 40) return;
        sent.add(key);
        var body = JSON.stringify({v: 1, event: event, path: path, target: target || '',
            source: source(), previous: cleanPath(document.referrer), active: Math.floor(active), depth: maxDepth});
        // No cookies/credentials are sent to the collector. Failed events never block navigation.
        fetch('/api/website-events', {method: 'POST', headers: {'Content-Type': 'application/json'},
            body: body, credentials: 'omit', keepalive: true}).catch(function () {});
    }
    function depth() {
        if (!article) return;
        var box = article.getBoundingClientRect();
        var seen = Math.max(0, Math.min(100, Math.floor((innerHeight - box.top) / Math.max(box.height, 1) * 100)));
        maxDepth = Math.max(maxDepth, seen);
        if (active >= 5) [25, 50, 75, 90].forEach(function (n) { if (maxDepth >= n) emit('scroll_' + n); });
        if (active >= 60 && maxDepth >= 90) emit('read_complete');
    }
    function tick() {
        var now = performance.now();
        if (started && document.visibilityState === 'visible' && document.hasFocus() && now - lastInteraction < 60000) {
            active += Math.min((now - lastTick) / 1000, 5);
        }
        lastTick = now;
        if (document.visibilityState !== 'visible') return;
        depth();
        [30, 60, 120].forEach(function (n) { if (active >= n) emit('active_' + n); });
    }
    function start() {
        if (started || document.visibilityState !== 'visible' || document.prerendering || excluded()) return;
        started = true;
        lastTick = performance.now();
        lastInteraction = lastTick;
        emit('page_view');
        // Cloudflare's public RUM token is substituted from the verified site configuration at build time.
        if (!document.querySelector('script[data-cf-beacon]')) {
            var script = document.createElement('script');
            script.defer = true;
            script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
            script.setAttribute('data-cf-beacon', JSON.stringify({token: '0b609f35d8524a18bcec088e13c8c85d', spa: false}));
            document.head.appendChild(script);
        }
    }
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (event) {
        addEventListener(event, function () { lastInteraction = performance.now(); }, {passive: true});
    });
    document.addEventListener('visibilitychange', function () { tick(); start(); });
    document.addEventListener('prerenderingchange', start);
    addEventListener('pageshow', function () { lastTick = performance.now(); start(); });
    addEventListener('pagehide', tick);
    document.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a[href]');
        if (!link) return;
        var url;
        try { url = new URL(link.href, location.href); } catch (_) { return; }
        if (url.hostname === 'apps.apple.com' && /\/id6747951805(?:\/|$)/.test(url.pathname)) emit('store_click', 'ios');
        else if (url.hostname === 'play.google.com' && url.searchParams.get('id') === 'com.davidemoscato.kanjidon') emit('store_click', 'android');
        else if (url.origin === location.origin && url.pathname !== location.pathname) emit('navigation_click', url.pathname);
        else if (url.origin === location.origin && url.hash) emit('section_click');
        else if (url.protocol === 'https:' || url.protocol === 'http:') emit('outbound_click');
    });
    setInterval(tick, 5000);
    start();
})();
