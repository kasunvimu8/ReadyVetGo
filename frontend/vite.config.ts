import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), differHeavyModuleSourcemapsPlugins()],
  server: {
    port: 3000,
  },
  preview: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: "build",
    sourcemap: false,
    rollupOptions: {
      maxParallelFileOps: 1,
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor"
          }
        },
        sourcemapIgnoreList: (relativeSourcePath) => {
          const normalizedPath = path.normalize(relativeSourcePath)
          return normalizedPath.includes("node_modules")
        },
      },
      cache: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

function differHeavyModuleSourcemapsPlugins() {
  const heavyPackages = ["@dnd-kit/core", "@dnd-kit/sortable"]

  return {
    name: "differ-mui-sourcemap",
    transform(code: string, id: string) {
      if (heavyPackages.some((pkg) => id.includes(pkg))) {
        return {
          code: code,
          map: null,
        }
      }
    },
  }
}
