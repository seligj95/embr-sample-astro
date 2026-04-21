// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import preact from "@astrojs/preact";

// Standalone mode (not "middleware") — we need a long-running Node HTTP
// server that Embr can point traffic at. Adapter-node standalone produces
// ./dist/server/entry.mjs and reads HOST / PORT from env.
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [preact()],
});
