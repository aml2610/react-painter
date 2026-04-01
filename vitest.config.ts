import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      reporter: ['text-summary', 'text'],
    },
  },
});
