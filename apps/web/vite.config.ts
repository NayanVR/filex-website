import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { varlockVitePlugin } from "@varlock/vite-integration";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  server: {
    port: 3001,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    varlockVitePlugin({ ssrInjectMode: "resolved-env" }),
    tailwindcss(),
    // Every page is static: render them all to HTML at build time.
    tanstackStart({ prerender: { crawlLinks: true, enabled: true } }),
    nitro(),
    viteReact(),
  ],
  // Bundle all SSR deps for the build: Vercel functions have no node_modules at runtime.
  // Not in dev, where inlining makes Vite evaluate CommonJS React as ESM ("module is not defined").
  ssr: {
    noExternal: command === "build" ? true : undefined,
  },
}));
