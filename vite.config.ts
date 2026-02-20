import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import lucidePreprocess from 'vite-plugin-lucide-preprocess';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [lucidePreprocess(), tailwindcss(), tanstackRouter(), react(), flowbiteReact()],
});