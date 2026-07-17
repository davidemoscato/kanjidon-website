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
        if (link.closest('.download')) return 'download';
        if (link.closest('.hero')) return 'hero';
        return 'header';
    }

    document.querySelectorAll('[data-smart-download]').forEach(function (link) {
        var placement = placementFor(link);
        link.href = platform ? '/go/' + platform + '/' + placement + '/' : '#download';
    });

    document.querySelectorAll('a[href*="apps.apple.com"]').forEach(function (link) {
        link.href = '/go/ios/' + placementFor(link) + '/';
    });

    document.querySelectorAll('a[href*="play.google.com/store/apps/details"]').forEach(function (link) {
        link.href = '/go/android/' + placementFor(link) + '/';
    });
})();
