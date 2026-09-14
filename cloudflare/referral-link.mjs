// Match Flutter's ReferralLink: an unchanged 64-bit invite identifier encoded
// as 11 canonical Base64url characters. This never accepts an invitation.
export function referralShortPath(code) {
  if (typeof code !== 'string' || !/^KD[0-9A-F]{16}$/.test(code)) return null;
  const bytes = code.slice(2).match(/../g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
  return '/i/' + btoa(bytes).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function referralCodeFromUrl(url) {
  if (url.href.length > 4096 || url.username || url.password || url.hash) return null;
  if (url.pathname === '/open') {
    const codes = url.searchParams.getAll('invite');
    const targets = url.searchParams.getAll('to');
    return targets.length === 1 && targets[0] === 'referral' && codes.length === 1 && /^KD[0-9A-F]{16}$/.test(codes[0]) ? codes[0] : null;
  }
  const match = /^\/i\/([A-Za-z0-9_-]{11})$/.exec(url.pathname);
  if (!match || url.searchParams.has('invite') || url.searchParams.has('to')) return null;
  const bytes = atob(match[1].replaceAll('-', '+').replaceAll('_', '/') + '=');
  const code = 'KD' + Array.from(bytes, byte => byte.charCodeAt(0).toString(16).padStart(2, '0')).join('').toUpperCase();
  // Reject alternative encodings with nonzero padding bits.
  return bytes.length === 8 && referralShortPath(code) === url.pathname ? code : null;
}
