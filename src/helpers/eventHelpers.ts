import { SyntheticEvent } from 'react';

const extractOffSetFromEvent = (
  e: SyntheticEvent<HTMLCanvasElement>,
  scalingFactor: number,
  canvasRef: HTMLCanvasElement
) => {
  const {
    offsetX,
    offsetY,
    touches,
    clientX: mouseClientX,
    clientY: mouseClientY
  } = e.nativeEvent as any;
  // If offset coords are directly on the event we use them
  if (offsetX && offsetY) {
    return {
      offsetX: offsetX * scalingFactor,
      offsetY: offsetY * scalingFactor
    };
  }
  // Otherwise we need to calculate them as difference between (x, y) of event and (left, top) corner of canvas
  // We need to check whether user is using a touch device or just the mouse and extract
  // the touch/click coords accordingly
  const clientX = touches && touches.length ? touches[0].clientX : mouseClientX;
  const clientY = touches && touches.length ? touches[0].clientY : mouseClientY;
  const rect = canvasRef.getBoundingClientRect();
  const x = (clientX - rect.left) * scalingFactor;
  const y = (clientY - rect.top) * scalingFactor;
  return {
    offsetX: x,
    offsetY: y
  };
};

export { extractOffSetFromEvent };
