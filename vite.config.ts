import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// GitHub Pages: site em https://<user>.github.io/<repo>/
// Em dev (`vite`) usa `/`; em `vite build` usa o subpath do repositório.
const REPO_NAME = "felizaniversarioRUTH";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? `/${REPO_NAME}/` : "/",
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
