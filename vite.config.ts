import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: "http://172.17.1.15:5509",
        changeOrigin: true,
        // If your backend is HTTPS with a self-signed cert, uncomment:
        // secure: false,
      },
    },
  },
});
