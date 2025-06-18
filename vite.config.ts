import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      hooks: path.resolve(__dirname, "src/hooks"),
      pages: path.resolve(__dirname, "src/pages"),
      constants: path.resolve(__dirname, "src/constants"),
      api: path.resolve(__dirname, "src/api"),
      store: path.resolve(__dirname, "src/store"),
      shared: path.resolve(__dirname, "src/shared"),
      icons: path.resolve(__dirname, "src/icons"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://reqres.in",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
