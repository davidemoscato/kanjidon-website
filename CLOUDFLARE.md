# Cloudflare deployment

The website is served by Cloudflare Workers Static Assets. The Worker runs first
to preserve canonical redirects, security/cache headers, and the authoritative
list of URLs that must return `410 Gone`.

## Verify

```sh
pnpm install --frozen-lockfile
pnpm cf:check
```

Before a release, test the generated `workers.dev` URL for:

- the home page and representative localized pages;
- a real article, `robots.txt`, and `sitemap.xml`;
- a missing path (`404` plus `noindex`);
- a known retired path (`410` plus `noindex`);
- the `www` to apex redirect on the production hostname.

## Deploy and cut over

Deploy `kanjidon-site` without a production route first. Attach
`kanjidon.com/*` only after the preview checks pass. Keep the previous
`kanjidon-410` deployment available during the observation window so the route
can be moved back without changing DNS.

Email DNS records are unrelated to the Worker route and must not be edited as
part of a website release.
