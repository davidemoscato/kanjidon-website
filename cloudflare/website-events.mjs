// Curated aggregate events only. Never persist IP, User-Agent, cookies, user IDs or arbitrary URLs.
const EVENTS = new Set(['page_view', 'active_30', 'active_60', 'active_120', 'scroll_25', 'scroll_50',
  'scroll_75', 'scroll_90', 'read_complete', 'store_click', 'navigation_click', 'section_click', 'outbound_click']);
const SOURCES = new Set(['direct', 'internal', 'search', 'social', 'referral']);
const HEADERS = {'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff'};
const reply = (status) => new Response(null, {status, headers: HEADERS});

export async function collectWebsiteEvent(request, env, catalog) {
  if (request.method !== 'POST') return reply(405);
  if (new URL(request.url).hostname !== 'kanjidon.com') return reply(204);
  if (request.headers.get('Origin') !== 'https://kanjidon.com') return reply(403);
  if (request.headers.get('Sec-Fetch-Site') !== 'same-origin') return reply(403);
  if (request.headers.get('Sec-GPC') === '1' || request.headers.get('DNT') === '1') return reply(204);
  if (/bot|spider|crawler|headless|curl|python|KanjidonEditorialQA/i.test(request.headers.get('User-Agent') || '')) return reply(204);
  if (request.cf?.botManagement?.verifiedBot || (request.cf?.botManagement?.score ?? 100) < 30) return reply(204);
  // A per-location circuit breaker avoids retaining IP addresses or inventing visitor IDs.
  if (env.WEBSITE_EVENTS_LIMIT) {
    try {
      if (!(await env.WEBSITE_EVENTS_LIMIT.limit({key: 'website-events-v1'})).success) return reply(429);
    } catch (_) { return reply(503); }
  }
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415);
  if (Number(request.headers.get('Content-Length')) > 2048) return reply(413);
  // Bound streamed bodies as well as Content-Length; clients may omit or lie about the latter.
  let text = '';
  const reader = request.body?.getReader();
  if (!reader) return reply(400);
  const decoder = new TextDecoder();
  let bytes = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 2048) { await reader.cancel(); return reply(413); }
      text += decoder.decode(value, {stream: true});
    }
    text += decoder.decode();
    const data = JSON.parse(text);
    if (!data || data.v !== 1 || !EVENTS.has(data.event) || !Object.hasOwn(catalog, data.path)) return reply(400);
    const page = catalog[data.path];
    const active = Number(data.active);
    const depth = Number(data.depth);
    if (!Number.isInteger(active) || active < 0 || active > 86400 || !Number.isInteger(depth) || depth < 0 || depth > 100) return reply(400);
    if (data.event.startsWith('scroll_') && (page.kind !== 'article' || active < 5 || depth < Number(data.event.slice(7)))) return reply(400);
    if (data.event.startsWith('active_') && active < Number(data.event.slice(7))) return reply(400);
    if (data.event === 'read_complete' && (page.kind !== 'article' || active < 60 || depth < 90)) return reply(400);
    let target = '';
    if (data.event === 'navigation_click') {
      if (!Object.hasOwn(catalog, data.target)) return reply(400);
      target = data.target;
    } else if (data.event === 'store_click') {
      if (!['ios', 'android'].includes(data.target)) return reply(400);
      target = data.target;
    }
    const previous = Object.hasOwn(catalog, data.previous) ? data.previous : '';
    const source = SOURCES.has(data.source) ? data.source : 'direct';
    const country = /^[A-Z]{2}$/.test(request.cf?.country || '') ? request.cf.country : 'XX';
    const ua = request.headers.get('User-Agent') || '';
    const device = /iPad|Tablet/i.test(ua) ? 'tablet' : /Mobile|Android/i.test(ua) ? 'mobile' : 'desktop';
    if (!env.WEBSITE_ANALYTICS) return reply(503);
    env.WEBSITE_ANALYTICS.writeDataPoint({
      indexes: ['website-v1'],
      blobs: [data.event, data.path, page.article || '', page.locale, page.kind, source, previous, target, country, device, 'v1'],
      doubles: [1, Math.min(active, 1800), depth],
    });
    return reply(204);
  } catch (_) {
    // Do not log payloads or request headers. Analytics must not leak data through diagnostics.
    return reply(400);
  }
}
