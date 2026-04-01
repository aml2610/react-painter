import React, { useState, useRef, useCallback, useEffect } from 'react';
import { canvasToBlob } from './helpers/saveCanvasHelpers';
import { importImage } from './helpers/importImageHelpers';
import { extractOffSetFromEvent } from './helpers/eventHelpers';
import { getCanvasDimensionsScaledForImage } from './helpers/canvasHelpers';
import { fileToUrl, revokeUrl } from './helpers/objectUrlHelpers';
import { composeFn } from './helpers/miscHelpers';
import type {
  LineJoinType,
  LineCapType,
  PropsGetterInput,
  PropsGetterResult,
} from './ReactPainter';

export interface UsePainterProps {
  height?: number;
  width?: number;
  initialColor?: string;
  initialLineWidth?: number;
  initialLineJoin?: LineJoinType;
  initialLineCap?: LineCapType;
  onSave?: (blob: Blob) => void;
  image?: File | string;
}

export interface UsePainterResult {
  canvas: JSX.Element;
  triggerSave: () => void;
  getCanvasProps: (props?: PropsGetterInput) => PropsGetterResult;
  imageCanDownload: boolean | null;
  imageDownloadUrl: string | null;
  setColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  setLineJoin: (type: LineJoinType) => void;
  setLineCap: (type: LineCapType) => void;
}

export function usePainter({
  height = 300,
  width = 300,
  initialColor = '#000',
  initialLineWidth = 5,
  initialLineJoin = 'round',
  initialLineCap = 'round',
  onSave,
  image,
}: UsePainterProps = {}): UsePainterResult {
  const [color, setColorState] = useState(initialColor);
  const [lineWidth, setLineWidthState] = useState(initialLineWidth);
  const [lineJoin, setLineJoinState] = useState<LineJoinType>(initialLineJoin);
  const [lineCap, setLineCapState] = useState<LineCapType>(initialLineCap);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [imageCanDownload, setImageCanDownload] = useState<boolean | null>(null);
  const [imageDownloadUrl, setImageDownloadUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const scalingFactor = useRef(1);

  // Use refs for values accessed in stable callbacks to avoid stale closures
  const colorRef = useRef(color);
  const lineWidthRef = useRef(lineWidth);
  const lineJoinRef = useRef(lineJoin);
  const lineCapRef = useRef(lineCap);
  const isDrawingRef = useRef(isDrawing);
  const onSaveRef = useRef(onSave);

  colorRef.current = color;
  lineWidthRef.current = lineWidth;
  lineJoinRef.current = lineJoin;
  lineCapRef.current = lineCap;
  isDrawingRef.current = isDrawing;
  onSaveRef.current = onSave;

  const initCanvasContext = useCallback(() => {
    if (!canvasRef.current) return;
    ctx.current = canvasRef.current.getContext('2d');
    if (!ctx.current) return;
    ctx.current.strokeStyle = colorRef.current;
    ctx.current.lineWidth = lineWidthRef.current * scalingFactor.current;
    ctx.current.lineJoin = lineJoinRef.current;
    ctx.current.lineCap = lineCapRef.current;
  }, []);

  const initCanvasNoImage = useCallback(
    (w: number, h: number) => {
      if (!canvasRef.current) return;
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      setCanvasHeight(h);
      setCanvasWidth(w);
      initCanvasContext();
    },
    [initCanvasContext]
  );

  const initCanvasWithImage = useCallback(
    (w: number, imgWidth: number, imgHeight: number) => {
      if (!canvasRef.current) return;
      const [cvWidth, cvHeight, scalingRatio] = getCanvasDimensionsScaledForImage(
        w,
        imgWidth,
        imgHeight
      );
      canvasRef.current.width = imgWidth;
      canvasRef.current.height = imgHeight;
      setCanvasHeight(cvHeight);
      setCanvasWidth(cvWidth);
      scalingFactor.current = 1 / scalingRatio;
      initCanvasContext();
    },
    [initCanvasContext]
  );

  // Mount: initialize canvas and optionally load image
  useEffect(() => {
    document.body.style.touchAction = 'none';

    if (image) {
      importImage(image)
        .then(({ img, imgWidth, imgHeight }) => {
          initCanvasWithImage(width, imgWidth, imgHeight);
          ctx.current?.drawImage(img, 0, 0, imgWidth, imgHeight);
          setImageCanDownload(true);
        })
        .catch(() => {
          setImageCanDownload(false);
          initCanvasNoImage(width, height);
        });
    } else {
      initCanvasNoImage(width, height);
    }

    return () => {
      document.body.style.touchAction = '';
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up download URL on unmount
  useEffect(() => {
    return () => {
      if (imageDownloadUrl) {
        revokeUrl(imageDownloadUrl);
      }
    };
  }, [imageDownloadUrl]);

  const handleMouseDown = useCallback(
    (e: React.SyntheticEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;
      const { offsetX, offsetY } = extractOffSetFromEvent(
        e,
        scalingFactor.current,
        canvasRef.current
      );
      lastX.current = offsetX;
      lastY.current = offsetY;
      setIsDrawing(true);
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.SyntheticEvent<HTMLCanvasElement>) => {
      if (isDrawingRef.current && ctx.current && canvasRef.current) {
        const { offsetX, offsetY } = extractOffSetFromEvent(
          e,
          scalingFactor.current,
          canvasRef.current
        );
        const context = ctx.current;
        context.strokeStyle = colorRef.current;
        context.lineWidth = lineWidthRef.current * scalingFactor.current;
        context.lineCap = lineCapRef.current;
        context.lineJoin = lineJoinRef.current;
        context.beginPath();
        context.moveTo(lastX.current, lastY.current);
        context.lineTo(offsetX, offsetY);
        context.stroke();
        lastX.current = offsetX;
        lastY.current = offsetY;
      }
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleSave = useCallback(() => {
    if (!canvasRef.current) return;
    canvasToBlob(canvasRef.current, 'image/png')
      .then((blob: Blob) => {
        onSaveRef.current?.(blob);
        setImageDownloadUrl(fileToUrl(blob));
      })
      .catch((err) => console.error('in usePainter handleSave', err));
  }, []);

  const setColor = useCallback((c: string) => {
    setColorState(c);
  }, []);

  const setLineWidth = useCallback((w: number) => {
    setLineWidthState(w);
  }, []);

  const setLineJoin = useCallback((type: LineJoinType) => {
    setLineJoinState(type);
  }, []);

  const setLineCap = useCallback((type: LineCapType) => {
    setLineCapState(type);
  }, []);

  const getCanvasProps = useCallback(
    (props: PropsGetterInput = {}): PropsGetterResult => {
      const {
        onMouseDown,
        onTouchStart,
        onMouseMove,
        onTouchMove,
        onMouseUp,
        onTouchEnd,
        style,
        ref,
        ...restProps
      } = props;
      return {
        onMouseDown: composeFn(onMouseDown, handleMouseDown),
        onMouseMove: composeFn(onMouseMove, handleMouseMove),
        onMouseUp: composeFn(onMouseUp, handleMouseUp),
        onTouchEnd: composeFn(onTouchEnd, handleMouseUp),
        onTouchMove: composeFn(onTouchMove, handleMouseMove),
        onTouchStart: composeFn(onTouchStart, handleMouseDown),
        ref: composeFn(ref, (canvasElement: HTMLCanvasElement) => {
          canvasRef.current = canvasElement;
        }),
        style: {
          height: canvasHeight,
          width: canvasWidth,
          ...style,
        },
        ...restProps,
      };
    },
    [canvasHeight, canvasWidth, handleMouseDown, handleMouseMove, handleMouseUp]
  );

  const canvas = React.createElement('canvas', getCanvasProps());

  return {
    canvas,
    triggerSave: handleSave,
    getCanvasProps,
    imageCanDownload,
    imageDownloadUrl,
    setColor,
    setLineWidth,
    setLineJoin,
    setLineCap,
  };
}
