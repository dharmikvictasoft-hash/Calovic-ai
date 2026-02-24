import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(),  tailwindcss()],
  resolve: {
    alias: {
      "react-router-dom": path.resolve(__dirname, "src/router-compat.jsx"),
    },
  },
});
