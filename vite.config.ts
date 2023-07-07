import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [svgr(), react(),  nodePolyfills({
    // Whether to polyfill `node:` protocol imports.
    protocolImports: true,
  }),],
  // TODO: remove this when no longer deploying to GH pages
  base: '',
  define: {
    'process.env': process.env,
    VITE_CONFIG: {
      version: JSON.stringify(process.env.npm_package_version),
    },
  },
  // required for warp-contracts
  optimizeDeps: {
    exclude: ['vm2'],
  },
  build:{
    sourcemap:true,
    manifest:true
  }
 
});
