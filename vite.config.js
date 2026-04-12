import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Babel transform for runtime JSX (smaller output, no React import needed)
      jsxRuntime: 'automatic',
    }),
  ],

  base: '/ketul-portfolio/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@sections': path.resolve(__dirname, './src/components/sections'),
      '@layout': path.resolve(__dirname, './src/components/layout'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },

  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',

    // Warn on chunks > 600kB
    chunkSizeWarningLimit: 600,

    // Use esbuild for minification (faster than terser, near-identical output)
    minify: 'esbuild',

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Asset inlining threshold (4kB)
    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        // Stable content-hashed filenames for long-term caching
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? '';
          const ext = name.split('.').pop()?.toLowerCase();
          if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (['woff', 'woff2', 'ttf', 'eot'].includes(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (ext === 'css') {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },

        // Manual chunk splitting for optimal caching
        manualChunks: {
          // Core React runtime — changes least often
          'vendor-react': ['react', 'react-dom'],

          // Animation libraries — large, split separately
          'vendor-framer': ['framer-motion', 'motion'],
          'vendor-gsap': ['gsap'],
          'vendor-lenis': ['lenis'],

          // Icons — large tree-shaken set
          'vendor-icons': ['react-icons'],
        },
      },
    },
  },

  // Dev server optimisation
  server: {
    port: 5173,
    open: false,
    // Pre-bundle heavy deps so cold-start is instant
    hmr: { overlay: true },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'gsap', 'lenis', 'react-icons'],
  },
});
