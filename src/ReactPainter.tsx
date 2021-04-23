import * as PropTypes from 'prop-types';
import * as React from 'react';
import { canvasToBlob } from './helpers/saveCanvasHelpers';
import { importImage } from './helpers/importImageHelpers';
import { extractOffSetFromEvent } from './helpers/eventHelpers';
import { getCanvasDimensionsScaledForImage } from './helpers/canvasHelpers';
import { fileToUrl, revokeUrl } from './helpers/objectUrlHelpers';
import { composeFn } from './helpers/miscHelpers';

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
  imageCanDownload: boolean;
  imageDownloadUrl: string;
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
  imageCanDownload: boolean;
  imageDownloadUrl: string;
  isDrawing: boolean;
  color: string;
  lineWidth: number;
  lineJoin: LineJoinType;
  lineCap: LineCapType;
}

export class ReactPainter extends React.Component<ReactPainterProps, PainterState> {
  static propTypes = {
    color: PropTypes.string,
    height: PropTypes.number,
    image: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.string]),
    lineCap: PropTypes.string,
    lineJoin: PropTypes.string,
    lineWidth: PropTypes.number,
    onSave: PropTypes.func,
    render: PropTypes.func,
    width: PropTypes.number
  };

  static defaultProps: Partial<ReactPainterProps> = {
    height: 300,
    image: undefined,
    onSave: () => undefined,
    initialColor: '#000',
    initialLineCap: 'round',
    initialLineJoin: 'round',
    initialLineWidth: 5,
    width: 300
  };

  canvasRef: HTMLCanvasElement = null;
  ctx: CanvasRenderingContext2D = null;
  lastX = 0;
  lastY = 0;
  scalingFactor = 1;

  state: PainterState = {
    canvasHeight: 0,
    canvasWidth: 0,
    color: this.props.initialColor,
    imageCanDownload: null,
    imageDownloadUrl: null,
    isDrawing: false,
    lineCap: this.props.initialLineCap,
    lineJoin: this.props.initialLineJoin,
    lineWidth: this.props.initialLineWidth
  };

  handleMouseDown = (e: React.SyntheticEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = extractOffSetFromEvent(
      e,
      this.scalingFactor,
      this.canvasRef
    );
    this.lastX = offsetX;
    this.lastY = offsetY;
    this.setState({
      isDrawing: true
    });
  };

  handleMouseMove = (e: React.SyntheticEvent<HTMLCanvasElement>) => {
    const { color, lineWidth, lineCap, lineJoin } = this.state;
    if (this.state.isDrawing) {
      const { offsetX, offsetY } = extractOffSetFromEvent(
        e,
        this.scalingFactor,
        this.canvasRef
      );
      const ctx = this.ctx;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth * this.scalingFactor;
      ctx.lineCap = lineCap;
      ctx.lineJoin = lineJoin;
      const lastX = this.lastX;
      const lastY = this.lastY;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      this.lastX = offsetX;
      this.lastY = offsetY;
    }
  };

  handleMouseUp = () => {
    this.setState({
      isDrawing: false
    });
  };

  handleSave = () => {
    const { onSave } = this.props;
    canvasToBlob(this.canvasRef, 'image/png')
      .then((blob: Blob) => {
        onSave(blob);
        this.setState({
          imageDownloadUrl: fileToUrl(blob)
        });
      })
      .catch(err => console.error('in ReactPainter handleSave', err));
  };

  handleSetColor = (color: string) => {
    this.setState({
      color
    });
  };

  handleSetLineWidth = (lineWidth: number) => {
    this.setState({
      lineWidth
    });
  };

  handleSetLineJoin = (type: 'round' | 'bevel' | 'miter') => {
    this.setState({
      lineJoin: type
    });
  };

  handleSetLineCap = (type: 'round' | 'butt' | 'square') => {
    this.setState({
      lineCap: type
    });
  };

  initCanvasContext = () => {
    const { color, lineWidth, lineJoin, lineCap } = this.state;
    this.ctx = this.canvasRef.getContext('2d');
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth * this.scalingFactor;
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;
  };

  initCanvasNoImage = (width: number, height: number) => {
    this.canvasRef.width = width;
    this.canvasRef.height = height;
    this.setState({
      canvasHeight: height,
      canvasWidth: width
    });
    this.initCanvasContext();
  };

  initCanvasWithImage = (width: number, imgWidth: number, imgHeight: number) => {
    const [cvWidth, cvHeight, scalingRatio] = getCanvasDimensionsScaledForImage(
      width,
      imgWidth,
      imgHeight
    );
    this.canvasRef.width = imgWidth;
    this.canvasRef.height = imgHeight;
    this.setState({
      canvasHeight: cvHeight,
      canvasWidth: cvWidth
    });
    this.scalingFactor = 1 / scalingRatio;
    this.initCanvasContext();
  };

  componentDidMount() {
    const { width, height, image } = this.props;
    // Disable touch action as we handle it separately
    document.body.style.touchAction = 'none';
    if (image) {
      importImage(image)
        .then(({ img, imgWidth, imgHeight }) => {
          this.initCanvasWithImage(width, imgWidth, imgHeight);
          this.ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
          this.setState({
            imageCanDownload: true
          });
        })
        .catch(() => {
          this.setState({
            imageCanDownload: false
          });
          this.initCanvasNoImage(width, height);
        });
    } else {
      this.initCanvasNoImage(width, height);
    }
  }

  componentWillUnmount() {
    // Enable touch action again
    document.body.style.touchAction = null;
    revokeUrl(this.state.imageDownloadUrl);
  }

  getCanvasProps = (props: PropsGetterInput = {}): PropsGetterResult => {
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
      onMouseDown: composeFn(onMouseDown, this.handleMouseDown),
      onMouseMove: composeFn(onMouseMove, this.handleMouseMove),
      onMouseUp: composeFn(onMouseUp, this.handleMouseUp),
      onTouchEnd: composeFn(onTouchEnd, this.handleMouseUp),
      onTouchMove: composeFn(onTouchMove, this.handleMouseMove),
      onTouchStart: composeFn(onTouchStart, this.handleMouseDown),
      ref: composeFn(ref, (canvasRef: HTMLCanvasElement) => {
        this.canvasRef = canvasRef;
      }),
      style: {
        height: this.state.canvasHeight,
        width: this.state.canvasWidth,
        ...style
      },
      ...restProps
    };
  };

  render() {
    const { render } = this.props;
    const { imageCanDownload, imageDownloadUrl } = this.state;
    const canvasNode = <canvas {...this.getCanvasProps()} />;
    return typeof render === 'function'
      ? render({
          canvas: canvasNode,
          getCanvasProps: this.getCanvasProps,
          imageCanDownload,
          imageDownloadUrl,
          setColor: this.handleSetColor,
          setLineCap: this.handleSetLineCap,
          setLineJoin: this.handleSetLineJoin,
          setLineWidth: this.handleSetLineWidth,
          triggerSave: this.handleSave
        })
      : canvasNode;
  }
}
