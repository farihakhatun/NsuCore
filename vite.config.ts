/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    host: true,
    open: false,
    allowedHosts: true,
    proxy: {
      '/idp': {
        target: 'https://api.seliseblocks.com',
        changeOrigin: true,
        secure: true,
      },
      '/identifier': {
        target: 'https://api.seliseblocks.com',
        changeOrigin: true,
        secure: true,
      },
      '/content': {
        target: 'https://api.seliseblocks.com',
        changeOrigin: true,
        secure: true,
      },
      '/media': {
        target: 'https://api.seliseblocks.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },

  build: {
    outDir: 'build',
    sourcemap: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
          ],
        },
      },
    },
  },

  envPrefix: 'VITE_',

  css: {
    postcss: './postcss.config.js',
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.polyfills.ts', './vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.spec.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.model.ts',
        'src/**/*.module.ts',
        'src/**/*.d.ts',
        'src/assets/**',
        'node_modules/**',
      ],
    },
    include: ['**/*.spec.{ts,tsx}'],
  },
});