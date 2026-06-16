# Public Hermes homepage proxy

The homepage is a static GitHub Pages site, so it cannot safely store `API_SERVER_KEY` or call the local Hermes API server directly. This proxy keeps the key server-side:

```text
browser ask-kitsune.html -> /api/hermes-chat proxy -> public-bot Hermes API server -> public profile
```

## Local Hermes side

Already configured locally:

- Profile: `public-bot`
- API server: `http://127.0.0.1:8643`
- Model name: `public-hermes`
- API key: stored only in `/Users/Jacob/.hermes/profiles/public-bot/.env`
- Docker workspace: `/Users/Jacob/HermesShared/public-bot:/workspace`

Do not copy the API key into frontend JavaScript.

## Deploying the Cloudflare Worker

This Worker can run only if it can reach the Hermes API server. Because the local server is bound to `127.0.0.1`, use one of these patterns:

1. Run the Worker/serverless proxy on the same machine/network as Hermes, or
2. Put Hermes behind a private authenticated tunnel/reverse proxy, then set `HERMES_API_BASE` to that private URL, or
3. Host the `public-bot` profile on a small server/VPS and keep `API_SERVER_HOST=127.0.0.1` with the proxy on the same host.

Example Cloudflare setup:

```bash
cd hermes-public-proxy
wrangler secret put HERMES_API_KEY
wrangler secret put HERMES_API_BASE   # e.g. https://private-hermes-proxy.example.com
wrangler secret put ALLOWED_ORIGIN    # https://tmad4000.github.io or custom domain
wrangler deploy cloudflare-worker.js
```

Then route `/api/hermes-chat` on the homepage domain to the Worker, or set this before loading `ask-kitsune.html`:

```html
<script>
  window.HERMES_PUBLIC_PROXY_URL = 'https://your-worker.example.com/api/hermes-chat';
</script>
```

## Persona & public context

The agent's persona and public knowledge about Jacob live in
[`public-agent-context.md`](./public-agent-context.md) (public info only —
mediator-Kitsune, third person about Jacob, no private data).

Two consumers must stay in sync with that file:

1. The Worker embeds a condensed copy as the `PUBLIC_AGENT_PROMPT` constant in
   `cloudflare-worker.js` (overridable via a `PUBLIC_AGENT_PROMPT` secret/env).
2. The local `public-bot` Hermes profile should be seeded with the same context
   so behavior matches whichever backend answers.

## Deployment status (known gap)

As of this writing the frontend default endpoint is an **ephemeral
`*.trycloudflare.com` quick-tunnel URL**, which does not survive restarts. When
it is down, both `ask-kitsune.html` and the homepage Kitsune panel show a quiet
"Kitsune is offline" message and point visitors to email — no secrets are
exposed. To make the agent durably live:

1. Deploy this Worker (or an equivalent same-host proxy) per the steps above.
2. Set a stable URL via `window.HERMES_PUBLIC_PROXY_URL` on the pages, or route
   `/api/hermes-chat` on the site domain to the Worker.
3. Replace the hard-coded `trycloudflare.com` fallback in `index.html` and
   `ask-kitsune.html` with the stable URL.

## Security checklist

- [ ] `API_SERVER_KEY` is only in server-side Worker/VPS secrets.
- [ ] Hermes API server is not exposed publicly without the proxy.
- [ ] Proxy enforces origin checks, message length limits, and no-store responses.
- [ ] Public profile Docker check says `TELEGRAM_BOT_TOKEN` and `API_SERVER_KEY` are absent inside `/workspace`.
- [ ] `public-bot` platform toolsets do not include `memory`, `session_search`, `skills`, `computer_use`, home automation, or private account tools.
