import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer plugin
    visualizer({
      filename: 'bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  // Build optimizations
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          // UI library chunks
          ui: ['lucide-react', 'framer-motion'],
          // Form chunks
          forms: ['react-hook-form', '@hookform/resolvers'],
        },
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'vendor') {
            return 'assets/vendor-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
      
      // Reduce bundle size with tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReaders: true,
        unknownGlobalSideEffects: false,
      },
      
      // Optimize dependencies
      external: (id) => {
        // Keep certain dependencies external if they're large and not needed at build time
        return ['sharp', 'canvas'].includes(id);
      },
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline small assets as base64
    
    // CSS optimization
    cssCodeSplit: true,
    
    // Report compressed size
    reportCompressedSize: true,
    
    // Generate manifest for better caching
    manifest: true,
    
    // Generate service worker for PWA
    serviceWorker: true,
  },
  
  // Development optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  
  // Resolve optimizations
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
    },
    
    // Prefer ES modules over CommonJS
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    mainFields: ['module', 'browser', 'main'],
    conditions: ['import', 'module', 'browser', 'default', 'production'],
  },
  
  // CSS optimizations
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        // Add PostCSS plugins for optimization
        require('autoprefixer'),
        require('cssnano')({
          preset: ['default'],
          plugins: [
            // Remove unused CSS
            require('postcss-discard-unused')({
              selectors: [
                // Discard unused hover states
                /[a-z-]+:hover/,
              ],
            }),
            // Optimize CSS
            require('postcss-merge-longhand'),
            require('postcss-merge-rules'),
            require('postcss-minify-params'),
          ],
        }),
      ],
    },
  },
  
  // Server optimizations
  server: {
    fs: {
      // Enable strict file serving for security
      strict: true,
    },
    
    // Preload important routes
    preTransformRequests: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
      },
    ],
    
    // HMR optimizations
    hmr: {
      overlay: true,
    },
  },
  
  // Preview optimizations
  preview: {
    port: 4173,
    strictPort: true,
    
    // Enable compression for preview
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  
  // Define experimental features
  experimental: {
    // Build optimizations
    renderBuiltUrl: (filename: string) => {
      // Custom URL handling for better asset management
      return `/${filename}`;
    },
    
    // Enable build optimizations
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    },
  },
  
  // Environment-specific settings
  define: {
    // Environment variables
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    
    // Feature flags
    __ENABLE_DEVTOOLS__: process.env.NODE_ENV !== 'production',
  },
  
  // Performance monitoring
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  
  // Bundle size limits
  chunkSizeWarningLimit: 500,
  
  // Generate stats for analysis
  rollupOptions: {
    onwarn: (warning, warn) => {
      // Suppress certain warnings if necessary
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    },
    
    onLog: (log, level) => {
      if (level === 'warn') {
        console.warn('[Vite Build Warning]:', log);
      }
    },
  },
  
  // External dependencies (don't bundle)
  externals: {
    // Keep large runtime dependencies external
    'sharp': 'sharp',
    'canvas': 'canvas',
    'bcrypt': 'bcrypt',
  },
  
  // Plugin configuration for better analysis
  plugins: [
    react(),
    visualizer({
      filename: 'bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});