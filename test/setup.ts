import { vi } from 'vitest';

// jest-canvas-mock expects the `jest` global; alias it to vitest's `vi`.
// Must be set before importing jest-canvas-mock, so we use dynamic import
// (static imports are hoisted above assignments).
(globalThis as any).jest = vi;

await import('jest-canvas-mock');
import '@testing-library/jest-dom';
