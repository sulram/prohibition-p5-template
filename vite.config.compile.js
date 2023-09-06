import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  plugins: [glsl({
    compress: true,
    warnDuplicatedImports: true,
  })],
  build: {
    rollupOptions: {
      input: {
        bundle: 'bundle.js'
      },
      output: {
        dir: 'compiled',
        entryFileNames: '[name].min.js',
        format: 'iife'
      }
    }
  }
});
