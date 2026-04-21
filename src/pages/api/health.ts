import type { APIRoute } from "astro";

// Opt out of prerendering so this is a live endpoint, not a static file.
export const prerender = false;

// Embr pings this endpoint every minute. Keep it dependency-free: no DB
// call, no cache call — just a liveness probe. If you want readiness
// semantics (DB reachable, cache reachable, etc.), add a separate
// /api/ready and point healthCheck.path at it instead.
export const GET: APIRoute = () =>
  Response.json(
    {
      status: "ok",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
