import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        dashboard: resolve(process.cwd(), "dashboard.html"),
        article: resolve(process.cwd(), "article.html"),
        podcast: resolve(process.cwd(), "podcast.html"),
      },
    },
  },
});
