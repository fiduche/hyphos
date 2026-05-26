# Infrastructure — hyphos.io

Operational reference for the `hyphos.io` marketing site. Captures what's set up, how it deploys, where the gotchas are, and what to do when something looks broken.

---

## Domains

| Domain | Purpose | Registrar | Nameservers |
|---|---|---|---|
| `hyphos.io` | Marketing site (this repo) | (your registrar) | Cloudflare (`kyle.ns.cloudflare.com`, `nena.ns.cloudflare.com`) |
| `www.hyphos.io` | Same site, www alias | — | Same as above |

Both apex and www are mapped as Custom Domains on the Cloudflare Worker. Cloudflare auto-manages the A records and SSL certs.

---

## Hosting

- **Platform:** Cloudflare Workers (static-assets pattern via the ASSETS binding)
- **Worker name:** `hyphos-website`
- **Account:** `daniel.m.newton@gmail.com`'s Cloudflare account
- **Workers.dev URL:** `https://hyphos-website.daniel-m-newton.workers.dev` (always live, even if custom domain breaks — useful for diagnostics)
- **Dashboard path:** Workers & Pages → `hyphos-website` → Settings

The Worker is a 5-line passthrough (`src/worker.js`) that delegates every request to the `ASSETS` binding, which serves the static `dist/` directory. Astro builds to `dist/` at build time. No SSR runtime.

---

## Deploy

**Push to `main` auto-deploys.** GitHub Actions workflow at `.github/workflows/deploy-cloudflare.yml`:

1. Checks out repo
2. `npm ci && npm run build` (Node 22)
3. `npx wrangler deploy` using `CLOUDFLARE_API_TOKEN` repo secret

End-to-end: ~30 seconds from push to live.

### To manually deploy from a local machine

Rare, but here's how:

```bash
npm install
npm run build
npx wrangler login    # one-time per machine
npx wrangler deploy
```

### To roll back a bad deploy

```bash
# See the last few deploys
git log --oneline -10

# Revert the bad commit
git revert <sha>
git push                 # auto-deploys the revert
```

Or via Cloudflare dashboard: Workers & Pages → hyphos-website → Deployments → click a prior version → **Rollback to this version**.

### Required GitHub secret

`CLOUDFLARE_API_TOKEN` — account-scoped, "Edit Cloudflare Workers" template. Same token works for both this repo and `fiduche/hyphos-consulting`. Generated at Cloudflare → My Profile → API Tokens.

---

## Email

**Status as of 2026-05-25:** `hello@hyphos.io` is NOT yet receiving mail. The site's hero form and contact CTAs reference this address; until email routing is configured those mailto links go nowhere.

### The hyphos.io Workspace situation

`hyphos.io` is the primary domain of a **separate Google Workspace account** from `hyphosconsulting.com`. The only user in the hyphos.io Workspace is `meeting@hyphos.io` (the Hyphos Notetaker bot — used for meeting transcription, not a real human inbox).

This means: the Google Workspace MX records on `hyphos.io` ARE live (they route real mail to the notetaker's Workspace inbox) — do NOT delete them under any circumstance.

### Plan for `hello@hyphos.io`

**Option chosen: Google Group** inside the hyphos.io Workspace.

Setup:
1. In hyphos.io Workspace admin → **Apps → Google Workspace → Groups for Business** → ensure ON
2. **Directory → Groups** → **+ Create group**
3. Name: `Hyphos hello`; Group email: `hello@hyphos.io`; Access type: **Public** or **Restricted**
4. Add member: `dnewton@hyphosconsulting.com` (the user's primary inbox, in Workspace #1)
5. Settings → "Who can post" → **Anyone on the web**

Result: mail to `hello@hyphos.io` → group → forwarded to `dnewton@hyphosconsulting.com`.

To reply *from* `hello@hyphos.io`, set up Gmail's "Send mail as" feature in the Workspace #1 inbox (Settings → Accounts → Send mail as → Add another email address → `hello@hyphos.io`).

### Why NOT Cloudflare Email Routing for this domain

Cloudflare Email Routing would require deleting the existing Google Workspace MX records, which would break the `meeting@hyphos.io` notetaker bot. Workspace handles it cleanly via Groups; no need to involve Cloudflare's email layer.

---

## MCP server

The site advertises a Hyphos MCP server (Model Context Protocol) — visitors are told they can connect any MCP-compatible client (Cursor, Claude Desktop / Code, ChatGPT once supported, custom clients) to query the knowledge graph from inside their existing AI tool.

The MCP server is hosted by the Hyphos backend, not this marketing site. See the main Hyphos product repo for endpoint details. This site links visitors to the connection flow but doesn't host the server itself.

---

## Common gotchas

### "The site is down for me but you say it's up"

Almost always one of these:

1. **WiFi router DNS cache** holding a stale "no such record" answer from before the custom domain was mapped. Restart the router; it clears on reboot.
2. **Browser DNS/SSL handshake cache** from a failed connection during cert provisioning. Hard refresh (⌘⇧R), incognito window, or fully quit-and-reopen the browser.
3. **iOS Safari** — pull-to-refresh isn't enough. Force-quit Safari from the app switcher, or long-press the refresh arrow → "Reload Page From Origin."

To prove the site is globally live, ignore your own browser:
- `dig +short A hyphos.io @1.1.1.1` (should return Cloudflare IPs)
- <https://dnschecker.org/#A/hyphos.io> (shows green checkmarks worldwide)
- <https://www.isitdownrightnow.com/hyphos.io.html>

### Cert just provisioned, doesn't load yet

Cloudflare provisions a new SSL cert per Custom Domain mapping. Takes a few minutes after adding. www and apex provision separately — sometimes one is ready before the other. Check `chrome://net-internals/#sockets` and flush socket pools if Chrome cached a failed handshake before the cert was ready.

### Recent deploy didn't show up

- Check the GitHub Actions run: <https://github.com/fiduche/hyphos/actions> — green checkmark on the latest commit?
- Workers takes ~10 sec to roll new versions to the edge after wrangler completes
- Browser is probably caching the old HTML. Hard refresh.

### Workflow failed at "Deploy to Cloudflare"

Almost always the `CLOUDFLARE_API_TOKEN` secret is missing, expired, or doesn't have the right scopes. Check <https://github.com/fiduche/hyphos/settings/secrets/actions> → the secret should exist. To rotate: generate a new token in Cloudflare → My Profile → API Tokens → "Edit Cloudflare Workers" template → Account: all, Zones: hyphos.io. Replace the GitHub secret.

---

## Related infrastructure

- **`fiduche/hyphos-consulting`** — sibling repo for `hyphosconsulting.com`. Same deploy pattern, same Cloudflare account, same API token. Separate Workspace account (Workspace #1 with primary `hyphosconsulting.com`, user `dnewton@hyphosconsulting.com`).
- **Foundation product page** — `hyphosconsulting.com/products#foundation`. Cross-linked from this site's home and pricing pages.
- **Hyphos backend** — separate repo, hosts the MCP server, the engagement object substrate, and the assistant.
