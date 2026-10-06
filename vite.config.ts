import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative paths let the build work from any folder, e.g. on GitHub Pages
  base: "./",
  plugins: [react()],
  server: {
    // In development API requests go through this proxy, so the session cookie is first-party
    proxy: {
      "/api": {
        target: "https://cinemaguide.skillbox.cc",
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "localhost",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
