// Preference precedence is independent of inviter identity and IP/location.
export function matchReferralLocale(value, supported) {
  if (typeof value !== 'string' || value.length > 64) return null;
  const tag = value.trim().toLowerCase().replaceAll('_', '-');
  if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(tag)) return null;
  const direct = supported.find(code => code.toLowerCase().replaceAll('_', '-') === tag);
  if (direct) return direct;
  const base = tag.split('-')[0];
  if (base === 'zh') {
    const traditional = /(?:^|-)hant(?:-|$)/.test(tag) || /(?:^|-)(?:tw|hk|mo)(?:-|$)/.test(tag);
    return supported.includes(traditional ? 'zh_TW' : 'zh_CN') ? traditional ? 'zh_TW' : 'zh_CN' : null;
  }
  return supported.includes(base) ? base : null;
}

export function selectReferralLocale({explicit, remembered, languages = [], acceptLanguage = ''}, supported) {
  for (const value of [explicit, remembered]) {
    const match = matchReferralLocale(value, supported);
    if (match) return match;
  }
  // Browser navigator.languages already carries preference order. A server
  // uses Accept-Language instead, respecting quality and original tie order.
  const browser = Array.isArray(languages) ? languages.slice(0, 20) : [];
  const header = typeof acceptLanguage === 'string' ? acceptLanguage.slice(0, 4096).split(',').slice(0, 20) : [];
  const parsed = header.map((entry, index) => {
    const [tag, quality, ...rest] = entry.trim().split(';').map(x => x.trim());
    if (rest.length || (quality && !/^q=(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(quality))) return null;
    return {tag, index, quality: quality ? Number(quality.slice(2)) : 1};
  }).filter(x => x && x.quality > 0).sort((a, b) => b.quality - a.quality || a.index - b.index);
  for (const value of [...browser, ...parsed.map(x => x.tag)]) {
    const match = matchReferralLocale(value, supported);
    if (match) return match;
  }
  return 'en';
}
