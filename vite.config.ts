import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import lucidePreprocess from 'vite-plugin-lucide-preprocess'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import flowbiteReact from 'flowbite-react/plugin/vite'
import { compression } from 'vite-plugin-compression2'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
  plugins: [
    lucidePreprocess(),
    tailwindcss(),
    tanstackRouter(),
    react(),
    flowbiteReact(),
    compression({
      algorithms: ['gzip'],
      deleteOriginalAssets: true,
      filename: (id) => {
        const { base } = path.parse(id)
        const cleanBase = base.replace(/-[a-z0-9]{6,}(?=\.)/, '')
        return `${cleanBase}.gz`
      },
    }),
  ],
})
