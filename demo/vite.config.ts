import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/react-painter/',
  plugins: [react()],
  resolve: {
    alias: {
      'react-painter': path.resolve(__dirname, '../src'),
    },
  },
});
