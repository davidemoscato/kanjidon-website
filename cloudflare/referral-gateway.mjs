const encoder = new TextEncoder();
const codePattern = /^KD[0-9A-F]{16}$/;
const upstream = 'https://gjralasjbogndfzkcczc.supabase.co/functions/v1/referral-invitation-preview';
const headers = {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow'};
const response = (state, status) => new Response(JSON.stringify({version: 1, state}), {status, headers});
const hex = bytes => [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, '0')).join('');

async function limitedJson(stream, maximum) {
  const reader = stream?.getReader();
  if (!reader) throw new Error('body');
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) throw new Error('body');
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const value of chunks) { bytes.set(value, offset); offset += value.byteLength; }
    return JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes));
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}

export async function referralGateway(request, env, fetchUpstream = fetch) {
  if (env.REFERRALS_ENABLED !== 'true' || !/^[a-f0-9]{64}$/.test(env.REFERRAL_GATEWAY_SECRET || '') ||
      !env.REFERRAL_PREVIEW_LIMIT) return response('unavailable', 503);
  if (request.method !== 'POST') return response('unavailable', 405);
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin ||
      request.headers.get('Sec-Fetch-Site') === 'cross-site') return response('unavailable', 403);
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) { console.warn('Referral preview: client address unavailable'); return response('unavailable', 503); }
  let phase = 'signature';
  try {
    const key = await crypto.subtle.importKey('raw', encoder.encode(env.REFERRAL_GATEWAY_SECRET), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
    const sign = async text => hex(await crypto.subtle.sign('HMAC', key, encoder.encode(text)));
    // Per-location abuse throttle, not eligibility or a global fraud signal.
    // The limiter sees a daily rotating digest, never the IP or invitation code.
    const day = new Date().toISOString().slice(0, 10);
    const limitKey = await sign(`referral-rate-v1\n${day}\n${ip}`);
    phase = 'rate_limit';
    if (!(await env.REFERRAL_PREVIEW_LIMIT.limit({key: limitKey})).success) return response('unavailable', 429);
    let body;
    try { body = await limitedJson(request.body, 256); } catch { return response('invalid_invitation', 400); }
    if (!body || Object.keys(body).length !== 1 || typeof body.invite_code !== 'string' || !codePattern.test(body.invite_code)) {
      return response('invalid_invitation', 400);
    }
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signature = await sign(`referral-preview-v1\n${timestamp}\n${body.invite_code}`);
    phase = 'upstream';
    const result = await fetchUpstream(upstream, {
      // workerd rejects redirect:'error'. Manual mode plus the !ok check below
      // prevents forwarding the signed request to any redirected destination.
      method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(5000),
      headers: {'Content-Type': 'application/json', 'X-Referral-Timestamp': timestamp, 'X-Referral-Signature': signature},
      body: JSON.stringify(body),
    });
    if (!result.ok) {
      await result.body?.cancel();
      if (result.status !== 404) console.warn('Referral preview: upstream status', result.status);
      return response(result.status === 404 ? 'invalid_invitation' : 'unavailable', result.status === 404 ? 404 : 503);
    }
    phase = 'upstream_contract';
    const data = await limitedJson(result.body, 2048);
    if (data.version !== 1 || data.state !== 'ready' || data.invite_code !== body.invite_code ||
        !Number.isInteger(data.invitee_bonus_tama) || data.invitee_bonus_tama < 0 || data.invitee_bonus_tama > 100000 ||
        (data.inviter_name !== null && (typeof data.inviter_name !== 'string' || [...data.inviter_name].length > 80))) throw new Error('contract');
    return new Response(JSON.stringify({version: 1, state: 'ready', invite_code: data.invite_code,
      inviter_name: data.inviter_name, invitee_bonus_tama: data.invitee_bonus_tama}), {status: 200, headers});
  } catch { console.warn('Referral preview: request failed', phase); return response('unavailable', 503); }
}
