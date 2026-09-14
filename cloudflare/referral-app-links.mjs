// Extend the current association asset, so future app IDs and paths remain
// authoritative in the site's existing .well-known file.
export async function referralAppLinks(request, env) {
  const asset = await env.ASSETS.fetch(new Request(request.url));
  if (asset.status !== 200) return request.method === 'HEAD' ? new Response(null, asset) : asset;
  const association = await asset.json();
  const app = association.applinks?.details?.find(detail => detail.appID === '5WQPL42A94.com.davidemoscato.kanjidon');
  if (!Array.isArray(app?.paths)) throw new Error('Kanjidon app association contract changed');
  if (!app.paths.includes('/i/*')) app.paths.push('/i/*');
  const headers = new Headers(asset.headers);
  for (const key of ['Content-Length', 'Content-Encoding', 'ETag', 'Last-Modified']) headers.delete(key);
  headers.set('Content-Type', 'application/json');
  headers.set('Cache-Control', 'public, max-age=3600');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return new Response(request.method === 'HEAD' ? null : JSON.stringify(association) + '\n', {headers});
}
