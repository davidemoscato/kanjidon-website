(function () {
    'use strict';

    var GOOGLE_STORE_CONVERSION = 'AW-17488655629/FsszCMPn7_AbEI3qnpNB';
    var userAgent = navigator.userAgent || '';
    var isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    var isIOS = /iPad|iPhone|iPod/i.test(userAgent) || isIPadOS;
    var isAndroid = /Android/i.test(userAgent);
    var platform = isIOS ? 'ios' : (isAndroid ? 'android' : null);

    function placementFor(link) {
        if (link.dataset.placement) return link.dataset.placement;
        if (link.closest('.sticky-download-bar')) return 'sticky';
        if (link.closest('.download, .final-cta')) return 'download';
        if (link.closest('.hero')) return 'hero';
        return 'header';
    }

    // Only campaign metadata, never click IDs, arbitrary query values or user IDs.
    // Page-local by design: no cookies, storage or attribution across visits.
    function metaAttribution() {
        if (window.kanjidonAdvertisingConsentGranted !== true
            || navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return null;
        try {
            var params = new URL(window.location.href).searchParams;
            var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
            if (keys.some(function (key) { return params.getAll(key).length > 1; })) return null;
            var source = params.get('utm_source');
            if (['fb', 'ig', 'msg', 'an', 'th', 'facebook', 'instagram', 'messenger', 'threads'].indexOf(source) < 0
                || params.get('utm_medium') !== 'paid_social'
                || params.get('utm_campaign') !== 'meta_jlpt_video_6lang') return null;
            var content = params.get('utm_content') || '';
            if (!/^(it|fr|de|en|es|pt)_[0-9]{10,20}$/.test(content)) return null;
            var term = params.get('utm_term') || '';
            return { source: source, content: content,
                term: ['feed', 'story', 'stories', 'reels', 'facebook_feed', 'instagram_feed',
                    'instagram_stories', 'facebook_stories', 'instagram_reels', 'facebook_reels',
                    'marketplace', 'search', 'video_feeds', 'explore', 'threads_feed'].indexOf(term.toLowerCase()) >= 0 ? term : '' };
        } catch (_) { return null; }
    }

    function destinationFor(targetPlatform, placement) {
        var meta = metaAttribution();
        if (targetPlatform === 'ios') return 'https://apps.apple.com/app/apple-store/id6747951805?pt=121509463&ct='
            + (meta ? 'meta_jlpt_video_6lang' : 'website_install') + '&mt=8';
        var campaign = 'utm_source=kanjidon.com&utm_medium=website&utm_campaign=website_install&utm_content=' + placement;
        if (meta) {
            campaign = 'utm_source=' + encodeURIComponent(meta.source)
                + '&utm_medium=paid_social&utm_campaign=meta_jlpt_video_6lang'
                + '&utm_content=' + encodeURIComponent(meta.content);
            if (meta.term) campaign += '&utm_term=' + encodeURIComponent(meta.term);
        }
        return 'https://play.google.com/store/apps/details?id=com.davidemoscato.kanjidon' + '&referrer=' + encodeURIComponent(campaign);
    }

    function recordGoogleStoreConversion() {
        if (window.kanjidonAdvertisingConsentGranted !== true || typeof window.gtag !== 'function') return;
        window.gtag('event', 'conversion', {
            send_to: GOOGLE_STORE_CONVERSION,
            value: 1.0,
            currency: 'EUR',
            event_timeout: 1000
        });
    }

    function recordClick(targetPlatform, placement) {
        recordGoogleStoreConversion();
        if (typeof window.kanjidonMeasureOpenAI === 'function') {
            window.kanjidonMeasureOpenAI('store_click_' + targetPlatform, placement);
        }
        if (!window.fetch) return;
        window.fetch('/go/' + targetPlatform + '/' + placement + '/', {
            method: 'GET',
            cache: 'no-store',
            credentials: 'omit',
            keepalive: true
        }).catch(function () {});
    }

    function configureStoreLink(link, targetPlatform) {
        if (link.dataset.storeRoutingReady === 'true') return;
        var placement = placementFor(link);
        function refreshDestination() { link.href = destinationFor(targetPlatform, placement); }
        refreshDestination();
        link.dataset.storeRoutingReady = 'true';
        if (platform) link.removeAttribute('target');
        // Re-read consent at interaction time, including keyboard, middle-click and copying links.
        ['pointerdown', 'focus', 'contextmenu', 'auxclick'].forEach(function (type) {
            link.addEventListener(type, refreshDestination);
        });
        link.addEventListener('click', function () {
            refreshDestination();
            recordClick(targetPlatform, placement);
        });
    }

    document.querySelectorAll('[data-smart-download]').forEach(function (link) {
        link.addEventListener('click', function () {
            if (typeof window.kanjidonMeasureOpenAI === 'function') {
                window.kanjidonMeasureOpenAI('download_click', placementFor(link));
            }
        });
        if (platform) configureStoreLink(link, platform);
        else link.href = '#download';
    });

    // Editorial articles also link to third-party apps. Route and measure only Kanjidon.
    function isKanjidonStoreLink(link, targetPlatform) {
        try {
            var url = new URL(link.href, window.location.href);
            if (targetPlatform === 'ios') {
                return url.hostname === 'apps.apple.com' && /\/id6747951805(?:\/|$)/.test(url.pathname);
            }
            return url.hostname === 'play.google.com' && url.pathname === '/store/apps/details'
                && url.searchParams.get('id') === 'com.davidemoscato.kanjidon';
        } catch (_) { return false; }
    }

    document.querySelectorAll('a[href*="apps.apple.com"]').forEach(function (link) {
        if (isKanjidonStoreLink(link, 'ios')) configureStoreLink(link, 'ios');
    });

    document.querySelectorAll('a[href*="play.google.com/store/apps/details"]').forEach(function (link) {
        if (isKanjidonStoreLink(link, 'android')) configureStoreLink(link, 'android');
    });
})();
