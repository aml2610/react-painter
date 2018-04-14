import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  canvasToBlob,
  checkImageCrossOriginAllowed,
  composeFn,
  fileToUrl,
  revokeUrl
} from './util';

// disable touchAction, else the draw on canvas would not work
// because window would scroll instead of draw on it
const setUpForCanvas = () => {
  document.body.style.touchAction = 'none';
};

const cleanUpCanvas = () => {
  document.body.style.touchAction = null;
};

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
}

export interface ReactPainterProps {
  height?: number;
  width?: number;
  color?: string;
  lineWidth?: number;
  lineJoin?: 'round' | 'bevel' | 'miter';
  lineCap?: 'round' | 'butt' | 'square';
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
    color: '#000',
    height: 300,
    image: undefined,
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 5,
    onSave() {
      // noop
    },
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
    imageCanDownload: null,
    imageDownloadUrl: null,
    isDrawing: false
  };

  extractOffSetFromEvent = (e: React.SyntheticEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY, touches } = e.nativeEvent as any;
    if (offsetX && offsetY) {
      return {
        offsetX: offsetX * this.scalingFactor,
        offsetY: offsetY * this.scalingFactor
      };
    }
    const rect = this.canvasRef.getBoundingClientRect();
    const x = (touches[0].clientX - rect.left) * this.scalingFactor;
    const y = (touches[0].clientY - rect.top) * this.scalingFactor;

    return {
      offsetX: x,
      offsetY: y
    };
  };

  initializeCanvas = (width: number, height: number, image?: HTMLImageElement) => {
    if (image) {
      const [cvWidth, cvHeight, scalingRatio] = this.getDrawImageCanvasSize(
        width,
        height,
        image.naturalWidth,
        image.naturalHeight
      );
      this.canvasRef.width = image.naturalWidth;
      this.canvasRef.height = image.naturalHeight;
      this.setState({
        canvasHeight: cvHeight,
        canvasWidth: cvWidth
      });
      this.scalingFactor = 1 / scalingRatio;
    } else {
      this.canvasRef.width = width;
      this.canvasRef.height = height;
      this.setState({
        canvasHeight: height,
        canvasWidth: width
      });
    }
    const { color, lineWidth, lineJoin, lineCap } = this.props;
    this.ctx = this.canvasRef.getContext('2d');
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth * this.scalingFactor;
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;
  };

  getDrawImageCanvasSize = (
    cWidth: number,
    cHeight: number,
    imageWidth: number,
    imageHeight: number
  ) => {
    if (imageWidth <= cWidth) {
      return [imageWidth, imageHeight, 1];
    }
    const scalingRatio = cWidth / imageWidth;
    return [cWidth, scalingRatio * imageHeight, scalingRatio];
  };

  handleMouseDown = (e: React.SyntheticEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = this.extractOffSetFromEvent(e);
    this.lastX = offsetX;
    this.lastY = offsetY;

    this.setState({
      isDrawing: true
    });
  };

  handleMouseMove = (e: React.SyntheticEvent<HTMLCanvasElement>) => {
    const { color, lineWidth, lineCap, lineJoin } = this.props;
    if (this.state.isDrawing) {
      const { offsetX, offsetY } = this.extractOffSetFromEvent(e);
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

  handleMouseUp = (e: React.SyntheticEvent<HTMLCanvasElement>) => {
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

  componentDidMount() {
    const { width, height, image } = this.props;
    setUpForCanvas();
    if (image) {
      const img = new Image();
      img.onload = () => {
        this.initializeCanvas(width, height, img);
        this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
      };
      if (typeof image === 'string') {
        checkImageCrossOriginAllowed(image).then(({ anonymous, withCredentials }) => {
          if (anonymous || withCredentials) {
            img.crossOrigin = anonymous ? 'anonymous' : 'use-credentials';
            img.src = image;
            this.setState({
              imageCanDownload: true
            });
          } else {
            img.src = '';
            this.setState({
              imageCanDownload: false
            });
          }
        });
      } else {
        img.src = fileToUrl(image);
        this.setState({
          imageCanDownload: true
        });
      }
    } else {
      this.initializeCanvas(width, height);
    }
  }

  componentWillUnmount() {
    cleanUpCanvas();
    revokeUrl(this.state.imageDownloadUrl);
  }

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
          triggerSave: this.handleSave
        })
      : canvasNode;
  }
}
