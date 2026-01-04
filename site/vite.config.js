import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages “project site” needs the repo base path.
  // actions/configure-pages provides this as an output; we pass it via env in the workflow.
  base: process.env.BASE_PATH || "/"
});