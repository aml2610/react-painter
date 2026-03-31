import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/react-painter/',
  plugins: [react()],
  resolve: {
    alias: {
      'react-painter': path.resolve(__dirname, '../src'),
      // Ensure prop-types resolves from demo/node_modules when imported by ../src
      'prop-types': path.resolve(__dirname, 'node_modules/prop-types'),
    },
  },
});
