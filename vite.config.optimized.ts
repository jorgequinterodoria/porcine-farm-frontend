import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    
    visualizer({
      filename: 'bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  
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
      
      
      external: (id) => {
        
        return ['sharp', 'canvas'].includes(id);
      },
    },
    
    
    assetsInlineLimit: 4096, 
    
    
    cssCodeSplit: true,
    
    
    reportCompressedSize: true,
    
    
    manifest: true,
    
    
    serviceWorker: true,
  },
  
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
    },
    
    
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    mainFields: ['module', 'browser', 'main'],
    conditions: ['import', 'module', 'browser', 'default', 'production'],
  },
  
  
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        
        require('autoprefixer'),
        require('cssnano')({
          preset: ['default'],
          plugins: [
            
            require('postcss-discard-unused')({
              selectors: [
                
                /[a-z-]+:hover/,
              ],
            }),
            
            require('postcss-merge-longhand'),
            require('postcss-merge-rules'),
            require('postcss-minify-params'),
          ],
        }),
      ],
    },
  },
  
  
  server: {
    fs: {
      
      strict: true,
    },
    
    
    preTransformRequests: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
      },
    ],
    
    
    hmr: {
      overlay: true,
    },
  },
  
  
  preview: {
    port: 4173,
    strictPort: true,
    
    
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  
  
  experimental: {
    
    renderBuiltUrl: (filename: string) => {
      
      return `/${filename}`;
    },
    
    
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
  
  
  rollupOptions: {
    onwarn: (warning, warn) => {
      
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
  
  
  externals: {
    
    'sharp': 'sharp',
    'canvas': 'canvas',
    'bcrypt': 'bcrypt',
  },
  
  
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