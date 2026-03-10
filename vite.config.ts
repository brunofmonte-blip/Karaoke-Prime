import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  // 📍 Garante que os caminhos sejam relativos e o localhost não se perca
  base: "./", 
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Impede que o CSS seja separado de um jeito que o localhost não ache
    cssCodeSplit: false, 
  }
});