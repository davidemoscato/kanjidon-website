(function () {
    'use strict';

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

    function destinationFor(targetPlatform, placement) {
        if (targetPlatform === 'ios') return "https://apps.apple.com/app/id6747951805";
        var campaign = 'utm_source=kanjidon.com&utm_medium=website&utm_campaign=website_install&utm_content=' + placement;
        return "https://play.google.com/store/apps/details?id=com.davidemoscato.kanjidon" + '&referrer=' + encodeURIComponent(campaign);
    }

    function recordClick(targetPlatform, placement) {
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
        link.href = destinationFor(targetPlatform, placement);
        link.dataset.storeRoutingReady = 'true';
        if (platform) link.removeAttribute('target');
        link.addEventListener('click', function () { recordClick(targetPlatform, placement); });
    }

    document.querySelectorAll('[data-smart-download]').forEach(function (link) {
        if (platform) configureStoreLink(link, platform);
        else link.href = '#download';
    });

    document.querySelectorAll('a[href*="apps.apple.com"]').forEach(function (link) {
        configureStoreLink(link, 'ios');
    });

    document.querySelectorAll('a[href*="play.google.com/store/apps/details"]').forEach(function (link) {
        configureStoreLink(link, 'android');
    });
})();
