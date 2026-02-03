import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Build optimizations
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['lucide-react', 'framer-motion'],
          forms: ['react-hook-form', '@hookform/resolvers'],
        },
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'vendor') {
            return 'assets/vendor-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReaders: true,
        unknownGlobalSideEffects: false,
      },
      external: (id) => ['sharp', 'canvas'].includes(id),
    },
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    reportCompressedSize: true,
    manifest: true,
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    mainFields: ['module', 'browser', 'main'],
    conditions: ['import', 'module', 'browser', 'default', 'production'],
  },
  
  css: {
    devSourcemap: true,
  },
  
  server: {
    fs: {
      strict: true,
    },
  },
  
  experimental: {
    renderBuiltUrl: (filename: string) => `/${filename}`,
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    },
  },
  
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __ENABLE_DEVTOOLS__: process.env.NODE_ENV !== 'production',
  },
  
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  
  chunkSizeWarningLimit: 500,
});