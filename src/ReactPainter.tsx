import React from 'react';
import { usePainter } from './usePainter';

export type LineJoinType = 'round' | 'bevel' | 'miter';
export type LineCapType = 'round' | 'butt' | 'square';

export interface CanvasProps {
  onMouseDown: React.MouseEventHandler<HTMLCanvasElement>;
  onTouchStart: React.TouchEventHandler<HTMLCanvasElement>;
  onMouseMove: React.MouseEventHandler<HTMLCanvasElement>;
  onTouchMove: React.TouchEventHandler<HTMLCanvasElement>;
  onMouseUp: React.MouseEventHandler<HTMLCanvasElement>;
  onTouchEnd: React.TouchEventHandler<HTMLCanvasElement>;
  style: React.CSSProperties;
  ref: (ref: HTMLCanvasElement) => void;
}

export interface PropsGetterInput extends Partial<CanvasProps> {
  [key: string]: any;
}

export interface PropsGetterResult extends CanvasProps {
  [key: string]: any;
}

export interface RenderProps {
  canvas: JSX.Element;
  triggerSave: () => void;
  getCanvasProps: (props: PropsGetterInput) => PropsGetterResult;
  imageCanDownload: boolean | null;
  imageDownloadUrl: string | null;
  setColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  setLineJoin: (type: LineJoinType) => void;
  setLineCap: (type: LineCapType) => void;
}

export interface ReactPainterProps {
  height?: number;
  width?: number;
  initialColor?: string;
  initialLineWidth?: number;
  initialLineJoin?: LineJoinType;
  initialLineCap?: LineCapType;
  onSave?: (blob: Blob) => void;
  image?: File | string;
  render?: (props: RenderProps) => JSX.Element;
}

export interface PainterState {
  canvasHeight: number;
  canvasWidth: number;
  imageCanDownload: boolean | null;
  imageDownloadUrl: string | null;
  isDrawing: boolean;
  color: string;
  lineWidth: number;
  lineJoin: LineJoinType;
  lineCap: LineCapType;
}

export const ReactPainter: React.FC<ReactPainterProps> = ({
  render,
  ...painterProps
}) => {
  const {
    canvas,
    triggerSave,
    getCanvasProps,
    imageCanDownload,
    imageDownloadUrl,
    setColor,
    setLineWidth,
    setLineJoin,
    setLineCap,
  } = usePainter(painterProps);

  if (typeof render === 'function') {
    return render({
      canvas,
      getCanvasProps,
      imageCanDownload,
      imageDownloadUrl,
      setColor,
      setLineCap,
      setLineJoin,
      setLineWidth,
      triggerSave,
    });
  }

  return canvas;
};
