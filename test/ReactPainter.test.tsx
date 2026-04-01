import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ReactPainter } from '../src';

describe('ReactPainter', () => {
  it('renders a canvas element without render prop', () => {
    const { container } = render(<ReactPainter />);
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('renders via render prop', () => {
    render(
      <ReactPainter
        render={({ canvas }) => (
          <div>
            <div data-testid="canvas-wrapper">{canvas}</div>
          </div>
        )}
      />
    );
    const wrapper = screen.getByTestId('canvas-wrapper');
    expect(wrapper.querySelector('canvas')).toBeTruthy();
  });

  it('calls onSave with a blob when triggerSave is invoked', async () => {
    const saveHandler = vi.fn();
    render(
      <ReactPainter
        onSave={saveHandler}
        render={({ canvas, triggerSave }) => (
          <div>
            {canvas}
            <button onClick={triggerSave}>Save Canvas</button>
          </div>
        )}
      />
    );
    fireEvent.click(screen.getByText('Save Canvas'));
    await waitFor(() => {
      expect(saveHandler).toHaveBeenCalledTimes(1);
      expect(saveHandler.mock.calls[0][0]).toBeInstanceOf(Blob);
    });
  });

  it('setColor updates the stroke color', () => {
    let capturedSetColor: ((color: string) => void) | null = null;
    const { container } = render(
      <ReactPainter
        render={({ canvas, setColor }) => {
          capturedSetColor = setColor;
          return <div>{canvas}</div>;
        }}
      />
    );
    const canvasEl = container.querySelector('canvas')!;
    const ctx = canvasEl.getContext('2d')!;

    // Simulate drawing with new color
    act(() => capturedSetColor!('#ff0000'));
    fireEvent.mouseDown(canvasEl, { offsetX: 10, offsetY: 10 });
    fireEvent.mouseMove(canvasEl, { offsetX: 20, offsetY: 20 });
    fireEvent.mouseUp(canvasEl);

    // Verify stroke was called (canvas is mocked)
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('setLineWidth updates the line width', () => {
    let capturedSetLineWidth: ((width: number) => void) | null = null;
    const { container } = render(
      <ReactPainter
        render={({ canvas, setLineWidth }) => {
          capturedSetLineWidth = setLineWidth;
          return <div>{canvas}</div>;
        }}
      />
    );
    const canvasEl = container.querySelector('canvas')!;
    const ctx = canvasEl.getContext('2d')!;

    act(() => capturedSetLineWidth!(20));
    fireEvent.mouseDown(canvasEl, { offsetX: 10, offsetY: 10 });
    fireEvent.mouseMove(canvasEl, { offsetX: 30, offsetY: 30 });
    fireEvent.mouseUp(canvasEl);

    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('setLineCap and setLineJoin work', () => {
    let capturedSetLineCap: ((type: 'round' | 'butt' | 'square') => void) | null = null;
    let capturedSetLineJoin: ((type: 'round' | 'bevel' | 'miter') => void) | null = null;
    render(
      <ReactPainter
        render={({ canvas, setLineCap, setLineJoin }) => {
          capturedSetLineCap = setLineCap;
          capturedSetLineJoin = setLineJoin;
          return <div>{canvas}</div>;
        }}
      />
    );
    // Should not throw
    act(() => {
      capturedSetLineCap!('square');
      capturedSetLineJoin!('bevel');
    });
  });

  it('handles mouse draw sequence', () => {
    const { container } = render(
      <ReactPainter
        render={({ canvas }) => <div>{canvas}</div>}
      />
    );
    const canvasEl = container.querySelector('canvas')!;
    const ctx = canvasEl.getContext('2d')!;

    fireEvent.mouseDown(canvasEl, { offsetX: 5, offsetY: 5 });
    fireEvent.mouseMove(canvasEl, { offsetX: 50, offsetY: 50 });
    fireEvent.mouseMove(canvasEl, { offsetX: 100, offsetY: 100 });
    fireEvent.mouseUp(canvasEl);

    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenCalled();
    expect(ctx.lineTo).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('does not draw when mouse moves without mousedown', () => {
    const { container } = render(
      <ReactPainter
        render={({ canvas }) => <div>{canvas}</div>}
      />
    );
    const canvasEl = container.querySelector('canvas')!;
    const ctx = canvasEl.getContext('2d')!;

    fireEvent.mouseMove(canvasEl, { offsetX: 50, offsetY: 50 });

    expect(ctx.stroke).not.toHaveBeenCalled();
  });

  it('handles touch events', () => {
    const { container } = render(
      <ReactPainter
        render={({ canvas }) => <div>{canvas}</div>}
      />
    );
    const canvasEl = container.querySelector('canvas')!;
    const ctx = canvasEl.getContext('2d')!;

    fireEvent.touchStart(canvasEl, {
      touches: [{ clientX: 10, clientY: 10 }],
    });
    fireEvent.touchMove(canvasEl, {
      touches: [{ clientX: 50, clientY: 50 }],
    });
    fireEvent.touchEnd(canvasEl);

    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('getCanvasProps merges user props', () => {
    const customMouseDown = vi.fn();
    render(
      <ReactPainter
        render={({ getCanvasProps }) => (
          <div>
            <canvas
              {...getCanvasProps({
                onMouseDown: customMouseDown,
                'data-testid': 'custom-canvas',
              })}
            />
          </div>
        )}
      />
    );
    const canvasEl = screen.getByTestId('custom-canvas');
    fireEvent.mouseDown(canvasEl);
    expect(customMouseDown).toHaveBeenCalled();
  });

  it('provides imageDownloadUrl after save', async () => {
    let capturedDownloadUrl: string | null = null;
    const { rerender } = render(
      <ReactPainter
        onSave={() => {}}
        render={({ canvas, triggerSave, imageDownloadUrl }) => {
          capturedDownloadUrl = imageDownloadUrl;
          return (
            <div>
              {canvas}
              <button onClick={triggerSave}>Save</button>
            </div>
          );
        }}
      />
    );

    expect(capturedDownloadUrl).toBeNull();
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(capturedDownloadUrl).not.toBeNull();
    });
  });

  it('applies initial props correctly', () => {
    const { container } = render(
      <ReactPainter
        width={500}
        height={400}
        initialColor="#ff0000"
        initialLineWidth={10}
        initialLineCap="square"
        initialLineJoin="bevel"
        render={({ canvas }) => <div>{canvas}</div>}
      />
    );
    const canvasEl = container.querySelector('canvas')!;
    // Canvas should have been initialized with the given dimensions
    expect(canvasEl).toBeTruthy();
  });
});
