# hyphos.io

Marketing site for Hyphos — the enterprise knowledge and apprenticeship layer above your operational systems.

**Live at:** [hyphos.io](https://hyphos.io)

## Stack

- **Astro 6** (static output)
- **Tailwind CSS 4**
- **Cloudflare Workers** (via the ASSETS binding — Astro builds to `dist/`, a 5-line worker delegates every request to the static assets)
- **CI deploys** from `main` via GitHub Actions (`.github/workflows/deploy-cloudflare.yml`)

## Local development

```bash
npm install
npm run dev      # localhost:4321
npm run build    # outputs to dist/
```

## Deploys

Push to `main` triggers an automatic Cloudflare deploy via GitHub Actions. The workflow:

1. Checks out the repo
2. `npm ci && npm run build`
3. `npx wrangler deploy` using the `CLOUDFLARE_API_TOKEN` repo secret

Manual deploy from a local machine (rarely needed):

```bash
npm run build
npx wrangler login    # one-time per machine
npx wrangler deploy
```

## Configuration

- `wrangler.toml` — Cloudflare Workers config (name, ASSETS binding, compatibility date)
- `src/worker.js` — 5-line passthrough worker
- `astro.config.mjs` — static output + sitemap
- Custom domain (`hyphos.io`, `www.hyphos.io`) is configured in the Cloudflare dashboard: Workers & Pages → `hyphos-website` → Settings → Domains & Routes

## Email

`hello@hyphos.io` is handled by Cloudflare Email Routing — forwarding only, not a real mailbox. See dashboard: `hyphos.io` → Email → Email Routing.

## Pages

- `/` — home
- `/about` — vision, values, Hyphos + Foundation
- `/architecture` — depth stack, knowledge packages, shared ontology, provenance
- `/pricing` — design-partner pilot shapes
- `/contact` — pilot inquiry form
- `/signup` — placeholder pointing to /contact (self-serve not yet open)
- `/login` — sign-in for existing pilot users
- `/privacy`, `/terms` — legal
