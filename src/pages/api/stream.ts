import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = () => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 1; i <= 5; i++) {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ chunk: i, timestamp: new Date().toISOString() }) +
              "\n",
          ),
        );
        if (i < 5) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-store",
    },
  });
};
