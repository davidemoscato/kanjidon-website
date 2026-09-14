import {referralGateway} from './referral-gateway.mjs';
import {selectReferralLocale, matchReferralLocale} from './referral-locale.mjs';
import {referralCodeFromUrl, referralShortPath} from './referral-link.mjs';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const play = 'https://play.google.com/store/apps/details?id=com.davidemoscato.kanjidon';
const apple = 'https://apps.apple.com/app/id6747951805';
const preferenceCookie = 'kanjidon_referral_locale_v1';

export function referralPlatform(userAgent = '') {
  const appleDevice = /\b(iPhone|iPad|iPod)\b/i.test(userAgent);
  const androidDevice = /\bAndroid\b/i.test(userAgent);
  if (appleDevice === androidDevice || /Windows Phone/i.test(userAgent)) return 'unknown';
  return appleDevice ? 'ios' : 'android';
}

export async function referralLanding(request, env, catalog, fetchUpstream = fetch) {
  const url = new URL(request.url);
  const supported = Object.keys(catalog);
  const explicit = url.searchParams.getAll('lang').length === 1 ? url.searchParams.get('lang') : null;
  const remembered = request.headers.get('Cookie')?.split(';').map(x => x.trim()).find(x => x.startsWith(`${preferenceCookie}=`))?.slice(preferenceCookie.length + 1);
  const locale = selectReferralLocale({explicit, remembered, acceptLanguage: request.headers.get('Accept-Language')}, supported);
  const text = catalog[locale];
  // A presentation hint only: never infer installation, identity or eligibility.
  // Desktop-mode iPads and unknown browsers retain both store destinations.
  const platform = referralPlatform(request.headers.get('User-Agent') || '');
  const installHint = platform === 'android' ? text.androidHint : text.hint;
  const code = referralCodeFromUrl(url);
  const valid = code !== null;
  let preview = null;
  let status = valid ? 503 : 400;
  if (!['GET', 'HEAD'].includes(request.method)) status = 405;
  else if (valid) {
    const result = await referralGateway(new Request(new URL('/api/referral-invitation', url), {
      method: 'POST', headers: {Origin: url.origin, 'CF-Connecting-IP': request.headers.get('CF-Connecting-IP') || ''},
      body: JSON.stringify({invite_code: code}),
    }), env, fetchUpstream);
    status = result.status;
    if (result.ok) preview = await result.json();
  }
  const title = preview?.inviter_name ? text.title.split('{name}').map(escape).join(`<bdi>${escape(preview.inviter_name)}</bdi>`) : escape(text.genericTitle);
  const languageFooter = text.footer.replace(/<a\b[^>]*class="[^"]*\blanguage-option\b[^>]*>/g, tag => {
    const lang = tag.match(/\blang="([^"]+)"/)?.[1];
    const match = matchReferralLocale(lang, supported);
    if (!match) throw new Error('Shared language menu contract changed');
    const target = new URL(code ? referralShortPath(code) : url.pathname, url.origin);
    target.search = new URLSearchParams({lang: match});
    return tag.replace(/href="[^"]*"/, `href="${escape(target.pathname + target.search)}"`);
  });
  const appUrl = `kanjidon://referral?invite=${code}`;
  const playUrl = preview ? `${play}&referrer=${encodeURIComponent(new URLSearchParams({invite: code, utm_source: 'kanjidon.com', utm_medium: 'referral', utm_campaign: 'invite_friend'}).toString())}` : play;
  const appleBadge = `<a class="referral-store referral-store-apple" href="${escape(apple)}" rel="noreferrer"><img src="${text.appleBadge}" alt="${escape(text.appleAlt)}" width="120" height="40"></a>`;
  const googleBadge = `<a class="referral-store referral-store-google" href="${escape(playUrl)}" rel="noreferrer"><img src="${text.googleBadge}" alt="${escape(text.googleAlt)}" width="646" height="250"></a>`;
  const storeBadges = platform === 'ios' ? appleBadge : platform === 'android' ? googleBadge : appleBadge + googleBadge;
  const html = `<!doctype html>
<html lang="${escape(text.htmlLang)}" dir="${text.dir}" data-site-layout="home">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><meta name="color-scheme" content="light dark">
<title>Kanjidon · ${escape(text.genericTitle)}</title><link rel="icon" href="/favicon.ico">
<script src="/inner-theme.js?v=20260911-adaptive"></script>
<link rel="stylesheet" href="/styles.css?v=20260905-review-swipe"><link rel="stylesheet" href="/site-theme.css?v=20260911-adaptive">
<style>
.referral-page{min-height:100svh;display:flex;flex-direction:column;overflow-wrap:break-word}
.referral-page .site-header{position:static;justify-content:center;padding:20px 20px 8px;border:0;background:transparent}
.referral-page .brand{font-size:22px;gap:10px;min-height:44px}
.referral-content{width:100%;max-width:540px;margin:auto;flex:1;padding:16px 20px 24px;display:flex;align-items:center}
.referral-card{width:100%;padding:32px 24px 28px;border:1px solid var(--theme-line);border-radius:24px;background:var(--theme-surface);text-align:center}
.referral-card h1{max-width:24ch;margin:0 auto;font-size:clamp(24px,5.5vw,32px);font-weight:700;line-height:1.25;overflow-wrap:anywhere;text-wrap:balance}
.referral-reward{margin-top:24px;color:var(--theme-accent);font-weight:800;line-height:1.1}
.referral-reward bdi{display:inline-flex;align-items:baseline;justify-content:center;flex-wrap:wrap;gap:8px}
.referral-amount{font-size:clamp(48px,13vw,64px);letter-spacing:-.03em}
.referral-currency{font-size:22px;font-weight:700}
.referral-stores{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 16px;margin:24px -8px 0;direction:ltr}
.referral-store{display:flex;align-items:center;justify-content:center;min-height:68px;border-radius:6px}
.referral-store img{display:block;max-width:none;height:auto}
.referral-store-apple img{width:132px}
.referral-store-google img{width:170px}
.referral-card p{max-width:34ch;margin:16px auto 0;color:var(--theme-muted);font-size:14px;line-height:1.5;text-wrap:pretty}
.referral-open{display:flex;align-items:center;justify-content:center;min-height:56px;padding:14px 20px;margin-top:20px;border-radius:12px;background:var(--theme-accent);color:var(--on-primary);font-weight:800;line-height:1.35;text-decoration:none}
.referral-open:focus-visible,.referral-store:focus-visible{outline:3px solid var(--theme-text);outline-offset:4px}
.referral-page .referral-footer{width:100%;padding:8px 20px 16px;border:0;text-align:center;display:block}
.referral-page .footer-bottom{margin:0;padding:0;border:0;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.referral-legal{display:flex;flex-wrap:wrap;justify-content:center;gap:0 16px;margin-top:8px;color:var(--theme-muted);font-size:12px}
.referral-legal a{display:inline-flex;align-items:center;min-height:40px;text-decoration:underline;text-underline-offset:3px}
.referral-copyright{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 12px;margin:4px 0 0;color:var(--theme-muted);font-size:12px}
.referral-page .language-options{left:auto;right:auto;inset-inline-end:0;inset-inline-start:auto}
@media(max-width:600px){.referral-page .language-options{position:fixed;left:16px;right:16px;bottom:96px;width:auto;max-width:360px;max-height:60svh;margin-inline:auto;z-index:200}}
@media(max-width:380px){.referral-content{padding:12px 16px 20px}.referral-card{padding:28px 16px 24px}.referral-stores{gap:0 10px}.referral-store-apple img{width:120px}.referral-store-google img{width:155px}}
</style></head>
<body id="top" class="referral-page">${text.header}<main class="referral-content"><section class="referral-card" aria-labelledby="referral-heading"><h1 id="referral-heading">${title}</h1>
${preview && preview.invitee_bonus_tama > 0 ? `<div class="referral-reward"><bdi><span class="referral-amount">+${escape(new Intl.NumberFormat(text.htmlLang).format(preview.invitee_bonus_tama))}</span> <span class="referral-currency">Tama</span></bdi></div>` : ''}
${preview ? '' : `<p role="status">${escape(status === 400 || status === 404 ? text.invalid : text.unavailable)}</p>`}
<div class="referral-stores">${storeBadges}</div>
${preview ? `<p>${escape(installHint)}</p><a class="referral-open" href="${escape(appUrl)}">${escape(text.open)}</a>` : ''}</section></main>${languageFooter}</body></html>`;
  const headers = {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store',
    'Vary': 'Accept-Language, Cookie, User-Agent', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow',
    'Content-Language': text.htmlLang, 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"};
  if (matchReferralLocale(explicit, supported)) {
    const cookiePath = url.pathname.startsWith('/i/') ? '/i/' : '/open';
    headers['Set-Cookie'] = `${preferenceCookie}=${locale}; Path=${cookiePath}; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax`;
  }
  return new Response(request.method === 'HEAD' ? null : html, {status, headers});
}
