/// <reference types="react" />
import * as PropTypes from 'prop-types';
import * as React from 'react';
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
    imageCanDownload: boolean;
    imageDownloadUrl: string;
    setColor: (color: string) => void;
    setLineWidth: (width: number) => void;
    setLineJoin: (type: 'round' | 'bevel' | 'miter') => void;
    setLineCap: (type: 'round' | 'butt' | 'square') => void;
}
export interface ReactPainterProps {
    height?: number;
    width?: number;
    initialColor?: string;
    initialLineWidth?: number;
    initialLineJoin?: 'round' | 'bevel' | 'miter';
    initialLineCap?: 'round' | 'butt' | 'square';
    onSave?: (blob: Blob) => void;
    image?: File | string;
    render?: (props: RenderProps) => JSX.Element;
}
export interface PainterState {
    canvasHeight: number;
    canvasWidth: number;
    imageCanDownload: boolean;
    imageDownloadUrl: string;
    isDrawing: boolean;
    color: string;
    lineWidth: number;
    lineJoin: 'round' | 'bevel' | 'miter';
    lineCap: 'round' | 'butt' | 'square';
}
export declare class ReactPainter extends React.Component<ReactPainterProps, PainterState> {
    static propTypes: {
        color: PropTypes.Requireable<any>;
        height: PropTypes.Requireable<any>;
        image: PropTypes.Requireable<any>;
        lineCap: PropTypes.Requireable<any>;
        lineJoin: PropTypes.Requireable<any>;
        lineWidth: PropTypes.Requireable<any>;
        onSave: PropTypes.Requireable<any>;
        render: PropTypes.Requireable<any>;
        width: PropTypes.Requireable<any>;
    };
    static defaultProps: Partial<ReactPainterProps>;
    canvasRef: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    lastX: number;
    lastY: number;
    scalingFactor: number;
    state: PainterState;
    extractOffSetFromEvent: (e: React.SyntheticEvent<HTMLCanvasElement>) => {
        offsetX: number;
        offsetY: number;
    };
    initializeCanvas: (width: number, height: number, image?: HTMLImageElement) => void;
    getDrawImageCanvasSize: (cWidth: number, cHeight: number, imageWidth: number, imageHeight: number) => number[];
    handleMouseDown: (e: React.SyntheticEvent<HTMLCanvasElement>) => void;
    handleMouseMove: (e: React.SyntheticEvent<HTMLCanvasElement>) => void;
    handleMouseUp: (e: React.SyntheticEvent<HTMLCanvasElement>) => void;
    handleSave: () => void;
    handleSetColor: (color: string) => void;
    handleSetLineWidth: (lineWidth: number) => void;
    handleSetLineJoin: (type: "round" | "bevel" | "miter") => void;
    handleSetLineCap: (type: "square" | "round" | "butt") => void;
    getCanvasProps: (props?: PropsGetterInput) => PropsGetterResult;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
