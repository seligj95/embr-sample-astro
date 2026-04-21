# Embr × Astro — SSR sample

A minimal Astro app configured for **server-side rendering** on
[Embr](https://github.com/coreai-microsoft/embr), using the
[`@astrojs/node`](https://docs.astro.build/en/guides/integrations-guide/node/)
adapter in `standalone` mode so Embr can run it as a long-lived Node HTTP
server.

It exercises:

- **Request-time SSR** via a page with `export const prerender = false` that
  stamps a timestamp + nonce on every request
- **Client-side hydration** via a tiny Preact island with `client:load`
- A dedicated **`/api/health`** endpoint for Embr's health check

See the companion
[Next.js App Router sample](https://github.com/seligj95/embr-sample-nextjs-app-router)
and
[Next.js Pages Router sample](https://github.com/seligj95/embr-sample-nextjs-pages)
for the same shape in a different framework.

## Deploy to Embr

```bash
npm install -g @coreai-microsoft/embr-cli
embr login

# "Use this template" (or fork), then:
embr quickstart deploy <your-user>/embr-sample-astro
```

## `embr.yaml`

```yaml
platform: nodejs
platformVersion: "22"
autoDeploy: true

run:
  port: 3000
  startCommand: "npm start"

healthCheck:
  enabled: true
  path: "/api/health"
  expectedStatusCode: 200
```

### Why these choices

- `platform: nodejs` + `platformVersion: "22"` — Astro 6 requires Node
  **>= 22.12.0**. Embr's default (Node 20) will fail the build with
  `"Node.js v20.x is not supported by Astro!"`, so pinning `platformVersion`
  is load-bearing here.
- **No `buildCommand`** — letting Oryx auto-detect from `package.json` is the
  reliable path. Setting `buildCommand` explicitly bypasses Oryx's Node
  pipeline and has been known to break Node apps on Embr.
- `run.startCommand: "npm start"` — resolves to
  `node ./dist/server/entry.mjs` with `HOST=0.0.0.0` and `PORT=${PORT:-3000}`.
  `PORT` is injected by Embr; `HOST=0.0.0.0` is important because the
  adapter-node default binds to localhost and the container wouldn't be
  reachable.
- `run.port: 3000` — matches the default `PORT`. Must match the port Embr
  exposes.
- `healthCheck.path: "/api/health"` — a live API route. A frontend page would
  always return 200 and hide crashes.

### Astro-specific notes

- `output: "server"` in `astro.config.mjs` flips Astro into SSR mode.
- `adapter: node({ mode: "standalone" })` — **standalone**, not `middleware`.
  Standalone produces `./dist/server/entry.mjs` which starts its own HTTP
  server. Middleware mode would hand you an Express-style handler you'd have
  to mount yourself.
- `export const prerender = false` on both the homepage and `/api/health` —
  Astro will pre-render anything that looks static at build time even in
  server mode, which would defeat the "prove SSR runs" test.
- The Preact island (`@astrojs/preact`) is what lets `client:load` work —
  Astro's plain `<script>` tags don't use client directives.

### What Embr does automatically

- Oryx detects `package.json`, runs `npm ci && npm run build`, and starts
  the container with `npm start`.
- Astro's static assets (`dist/client/_astro/*`) are served by the
  standalone Node server itself. If Embr's CDN layer picks them up that's a
  bonus — but correctness doesn't depend on it.

## What to check after deploy

1. `curl https://<deployment>/` twice — the timestamp + nonce on the
   homepage should change each request (proves SSR).
2. `curl https://<deployment>/api/health` — `{"status":"ok",…}` with
   HTTP 200.
3. Open `/` in a browser and click the counter — it should increment
   (proves hydration).

## Local dev

```bash
npm install
npm run dev
# or, to test the production server path:
npm run build && npm start
```
