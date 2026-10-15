import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5019",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:5019",
        changeOrigin: true,
        secure: false,
      },
    },
    // allow Render host for preview/dev when deployed on Render
    allowedHosts: true,
    host: "::",
    port: 8080,
    hmr: {
      overlay: true,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "pdf-tools": ["jspdf", "jspdf-autotable", "html2canvas"],
        },
      },
    },
  },
}));
