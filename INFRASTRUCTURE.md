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

**Primary contact address:** `info@hyphos.io` — live, receiving and sending natively. Used as the public contact email across both hyphos.io and hyphosconsulting.com marketing sites.

### The hyphos.io Workspace situation

`hyphos.io` is the primary domain of a **separate Google Workspace account** from `hyphosconsulting.com`. Two users exist in the hyphos.io Workspace:

| User | Role | Notes |
|---|---|---|
| `meeting@hyphos.io` | Hyphos Notetaker bot | Receives calendar invites; the Hyphos product joins meetings as this identity. Real user (Google/Zoom block bot accounts that don't have a real Workspace identity). Last active sign-in: low — used by automation. |
| `info@hyphos.io` | Public contact mailbox | Receives all pilot inquiries, sends replies natively (no SMTP wall). Real user, real Gmail inbox. |

Total seats in this Workspace: 2. Combined with Workspace #1 (`dnewton@hyphosconsulting.com`), total Google Workspace cost: 3 seats.

### Why a real user instead of an alias or forwarder

Earlier attempts at this used (a) a Google Group `hello@hyphos.io` forwarding to `dnewton@hyphosconsulting.com`, and (b) Gmail's "Send mail as" to reply from `hello@hyphos.io`. Both broke:

- The Group forwarding hit external-member subscription quirks and intermittent non-delivery
- "Send mail as" was blocked by Google's cross-Workspace SMTP restriction (cannot send AS an address in another Workspace's domain without that Workspace's SMTP credentials)

A real user in Workspace #2 sidesteps both problems entirely — same-Workspace send-as works native, no Group routing, normal Gmail deliverability.

### Day-to-day use

Two reasonable patterns:

- **Pattern A — Direct check.** Keep `info@hyphos.io` open as its own Gmail tab or in the Gmail account switcher. Check it daily.
- **Pattern B — Auto-forward + native account-switching reply.** In `info@hyphos.io` Gmail, set up Settings → Forwarding → forward a copy to `dnewton@hyphosconsulting.com`. Reads land in your main inbox. To reply, swap accounts in Gmail's top-right switcher and compose from `info@hyphos.io` natively.

### Do NOT delete the Google Workspace MX records

The MX records on `hyphos.io` route real mail to Workspace #2. Cloudflare's Email Routing setup screen will offer to "clean up incompatible records" — that would delete the Google MX and break both users. Always cancel out of that screen.

### Future: consolidating the two Workspaces

The two-Workspace setup costs the same as it would consolidated (~$21/mo for 3 seats either way) but adds friction (two admin consoles, plus the cross-Workspace SMTP wall for any future `@hyphos.io` from `@hyphosconsulting.com` setup). When there's a quiet weekend with no active notetaker use, consider:

1. Move `hyphos.io` to Workspace #1 as a *secondary domain* (involves canceling Workspace #2 to release the domain — ~24h downtime for the notetaker during the release window)
2. Recreate both `meeting@hyphos.io` and `info@hyphos.io` as users in Workspace #1
3. Result: one admin console, one billing, same cost

Not urgent. Defer until something forces the decision (hiring, branding push, or genuine consolidation appetite).

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
