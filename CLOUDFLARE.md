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

## Deploy

The production Worker is `kanjidon-410`; it already owns the `kanjidon.com`
custom domain. A Git push does not deploy Cloudflare. Upload and verify a
version before promoting it:

```sh
pnpm cf:build
pnpm exec wrangler versions upload \
  --preview-alias candidate \
  --message "Deploy <commit>: <summary>"

pnpm exec wrangler versions deploy \
  "<VERSION_ID>@100" \
  --name kanjidon-410 \
  --message "Production <commit>" \
  --yes
```

After promotion, repeat the checks on `https://kanjidon.com` and verify the
`www` redirect. Roll back Worker and assets together with:

```sh
pnpm exec wrangler rollback <PREVIOUS_VERSION_ID> \
  --name kanjidon-410 \
  --message "Rollback <commit>" \
  --yes
```

Email DNS records are unrelated to the Worker route and must not be edited as
part of a website release.
