import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = () =>
  Response.json(
    {
      probe: process.env.EMBR_SAMPLE_ENV_PROBE ?? null,
      nodeEnv: process.env.NODE_ENV ?? null,
      port: process.env.PORT ?? null,
    },
    { status: 200 },
  );
