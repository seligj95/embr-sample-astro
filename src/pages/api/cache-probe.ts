import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      epochMs: Date.now(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
