import { describe, it, expect, vi } from 'vitest';

describe('canvasHelpers', () => {
  it('returns original dimensions when image fits within canvas width', async () => {
    const { getCanvasDimensionsScaledForImage } = await import(
      '../src/helpers/canvasHelpers'
    );
    const result = getCanvasDimensionsScaledForImage(500, 300, 200);
    expect(result).toEqual([300, 200, 1]);
  });

  it('scales down when image is wider than canvas', async () => {
    const { getCanvasDimensionsScaledForImage } = await import(
      '../src/helpers/canvasHelpers'
    );
    const result = getCanvasDimensionsScaledForImage(300, 600, 400);
    expect(result[0]).toBe(300);
    expect(result[1]).toBe(200); // 400 * (300/600)
    expect(result[2]).toBeCloseTo(0.5);
  });

  it('returns exact width when image equals canvas width', async () => {
    const { getCanvasDimensionsScaledForImage } = await import(
      '../src/helpers/canvasHelpers'
    );
    const result = getCanvasDimensionsScaledForImage(300, 300, 300);
    expect(result).toEqual([300, 300, 1]);
  });
});

describe('miscHelpers', () => {
  it('composeFn calls all provided functions', async () => {
    const { composeFn } = await import('../src/helpers/miscHelpers');
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const composed = composeFn(fn1, fn2);
    composed('arg1', 'arg2');
    expect(fn1).toHaveBeenCalledWith('arg1', 'arg2');
    expect(fn2).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('composeFn skips undefined functions', async () => {
    const { composeFn } = await import('../src/helpers/miscHelpers');
    const fn1 = vi.fn();
    const composed = composeFn(undefined, fn1, undefined);
    composed('test');
    expect(fn1).toHaveBeenCalledWith('test');
  });
});

describe('objectUrlHelpers', () => {
  it('fileToUrl creates an object URL', async () => {
    const { fileToUrl } = await import('../src/helpers/objectUrlHelpers');
    const blob = new Blob(['test'], { type: 'text/plain' });
    const url = fileToUrl(blob);
    expect(typeof url).toBe('string');
  });

  it('revokeUrl does not throw', async () => {
    const { revokeUrl } = await import('../src/helpers/objectUrlHelpers');
    expect(() => revokeUrl('blob:http://localhost/fake')).not.toThrow();
  });
});

describe('saveCanvasHelpers', () => {
  it('canvasToBlob resolves with a Blob', async () => {
    const { canvasToBlob } = await import('../src/helpers/saveCanvasHelpers');
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const blob = await canvasToBlob(canvas, 'image/png');
    expect(blob).toBeInstanceOf(Blob);
  });
});
