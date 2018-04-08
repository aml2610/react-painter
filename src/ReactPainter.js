import PropTypes from 'prop-types';
import React from 'react';
import { canvasToBlob, fileToUrl, composeFn } from './util';

const setUpForCanvas = () => {
  document.body.style.touchAction = 'none';
};

const cleanUpCanvas = () => {
  document.body.style.touchAction = null;
};

class ReactPainterContainer extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    render: PropTypes.func.isRequired,
    color: PropTypes.string,
    onSave: PropTypes.func,
    image: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.string])
  };

  static defaultProps = {
    color: '#000',
    image: undefined,
    onSave() {
      // noop
    }
  };

  canvasRef = null;
  ctx = null;
  lastX = 0;
  lastY = 0;
  scalingFactor = 1;

  state = {
    isDrawing: false,
    canvasWidth: 0,
    canvasHeight: 0
  };

  extractOffSetFromEvent = e => {
    const { offsetX, offsetY, touches } = e.nativeEvent;
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

  initializeCanvas = (width, height, image) => {
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
        canvasWidth: cvWidth,
        canvasHeight: cvHeight
      });
      this.scalingFactor = 1 / scalingRatio;
    } else {
      this.canvasRef.width = width;
      this.canvasRef.height = height;
      this.setState({
        canvasWidth: width,
        canvasHeight: height
      });
    }
    this.ctx = this.canvasRef.getContext('2d');
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 5 * this.scalingFactor;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
  };

  getDrawImageCanvasSize = (cWidth, cHeight, imageWidth, imageHeight) => {
    if (imageWidth <= cWidth) {
      return [imageWidth, imageHeight, 1];
    }
    const scalingRatio = cWidth / imageWidth;
    return [cWidth, scalingRatio * imageHeight, scalingRatio];
  };

  handleMouseDown = e => {
    const { offsetX, offsetY } = this.extractOffSetFromEvent(e);
    this.lastX = offsetX;
    this.lastY = offsetY;

    this.setState({
      isDrawing: true
    });
  };

  handleMouseMove = e => {
    const { color } = this.props;
    if (this.state.isDrawing) {
      const { offsetX, offsetY } = this.extractOffSetFromEvent(e);
      const ctx = this.ctx;
      ctx.strokeStyle = color;
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

  handleMouseUp = e => {
    this.setState({
      isDrawing: false
    });
  };

  handleSave = () => {
    const { onSave } = this.props;
    canvasToBlob(this.canvasRef, 'image/png')
      .then(blob => onSave(blob))
      .catch(err => console.error('in ReactPainter handleSave', err));
  };

  getCanvasProps = (
    onMouseDown,
    onTouchStart,
    onMouseMove,
    onTouchMove,
    onMouseUp,
    onTouchEnd,
    style,
    ref,
    ...restProps
  ) => {
    return {
      onMouseDown: composeFn(onMouseDown, this.handleMouseDown),
      onTouchStart: composeFn(onTouchStart, this.handleMouseDown),
      onMouseMove: composeFn(onMouseMove, this.handleMouseMove),
      onTouchMove: composeFn(onTouchMove, this.handleMouseMove),
      onMouseUp: composeFn(onMouseUp, this.handleMouseUp),
      onTouchEnd: composeFn(onTouchEnd, this.handleMouseUp),
      ref: composeFn(ref, ref => {
        this.canvasRef = ref;
      }),
      style: {
        width: this.state.canvasWidth,
        height: this.state.canvasHeight,
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
      img.src = typeof image === 'string' ? image : fileToUrl(image);
    } else {
      this.initializeCanvas(width, height);
    }
  }

  componentWillUnmount() {
    cleanUpCanvas(this.eventListener);
  }

  render() {
    const { render } = this.props;
    const canvasNode = <canvas {...this.getCanvasProps()} />;
    return typeof render === 'function'
      ? render({
          canvas: canvasNode,
          triggerSave: this.handleSave,
          getCanvasProps: this.getCanvasProps
        })
      : canvasNode;
  }
}

export const ReactPainter = ReactPainterContainer;

export default ReactPainter;
