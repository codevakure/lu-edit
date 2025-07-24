import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Vite configuration optimizations for performance
 */
export const performanceConfig = defineConfig({
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate ReactFlow into its own chunk
          'reactflow': ['@xyflow/react'],
          
          // Separate icon libraries
          'icons-lucide': ['lucide-react'],
          'icons-fa': ['react-icons/fa'],
          'icons-custom': [
            './src/icons/eagerIconImports',
            './src/icons/lazyIconImports'
          ],
          
          // Separate UI components
          'ui-components': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tooltip'
          ],
          
          // Separate utilities
          'utils': ['lodash', 'moment', 'uuid'],
          
          // Separate large dependencies
          'editor': ['react-ace', 'ace-builds'],
          'pdf': ['react-pdf'],
          'charts': ['ag-grid-react', 'ag-grid-community']
        }
      }
    },
    
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn'] // Remove specific console methods
      }
    },
    
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    
    // Enable source maps for debugging (disable in production)
    sourcemap: process.env.NODE_ENV === 'development'
  },
  
  optimizeDeps: {
    // Pre-bundle these dependencies
    include: [
      '@xyflow/react',
      'lucide-react',
      'react-icons/fa',
      'lodash',
      'moment'
    ],
    
    // Exclude large dependencies from pre-bundling
    exclude: [
      'react-pdf',
      'ag-grid-community'
    ]
  },
  
  // Enable performance monitoring in development
  define: {
    __PERFORMANCE_MONITORING__: process.env.NODE_ENV === 'development'
  }
});

export default performanceConfig;
