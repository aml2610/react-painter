"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const PropTypes = require("prop-types");
const React = require("react");
const util_1 = require("./util");
const setUpForCanvas = () => {
    document.body.style.touchAction = 'none';
};
const cleanUpCanvas = () => {
    document.body.style.touchAction = null;
};
class ReactPainter extends React.Component {
    constructor() {
        super(...arguments);
        this.canvasRef = null;
        this.ctx = null;
        this.lastX = 0;
        this.lastY = 0;
        this.scalingFactor = 1;
        this.state = {
            isDrawing: false,
            canvasWidth: 0,
            canvasHeight: 0
        };
        this.extractOffSetFromEvent = (e) => {
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
        this.initializeCanvas = (width, height, image) => {
            if (image) {
                const [cvWidth, cvHeight, scalingRatio] = this.getDrawImageCanvasSize(width, height, image.naturalWidth, image.naturalHeight);
                this.canvasRef.width = image.naturalWidth;
                this.canvasRef.height = image.naturalHeight;
                this.setState({
                    canvasWidth: cvWidth,
                    canvasHeight: cvHeight
                });
                this.scalingFactor = 1 / scalingRatio;
            }
            else {
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
        this.getDrawImageCanvasSize = (cWidth, cHeight, imageWidth, imageHeight) => {
            if (imageWidth <= cWidth) {
                return [imageWidth, imageHeight, 1];
            }
            const scalingRatio = cWidth / imageWidth;
            return [cWidth, scalingRatio * imageHeight, scalingRatio];
        };
        this.handleMouseDown = (e) => {
            const { offsetX, offsetY } = this.extractOffSetFromEvent(e);
            this.lastX = offsetX;
            this.lastY = offsetY;
            this.setState({
                isDrawing: true
            });
        };
        this.handleMouseMove = (e) => {
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
        this.handleMouseUp = (e) => {
            this.setState({
                isDrawing: false
            });
        };
        this.handleSave = () => {
            const { onSave } = this.props;
            util_1.canvasToBlob(this.canvasRef, 'image/png')
                .then(blob => onSave(blob))
                .catch(err => console.error('in ReactPainter handleSave', err));
        };
        this.getCanvasProps = (props) => {
            const { onMouseDown, onTouchStart, onMouseMove, onTouchMove, onMouseUp, onTouchEnd, style, ref } = props, restProps = __rest(props, ["onMouseDown", "onTouchStart", "onMouseMove", "onTouchMove", "onMouseUp", "onTouchEnd", "style", "ref"]);
            return Object.assign({ onMouseDown: util_1.composeFn(onMouseDown, this.handleMouseDown), onTouchStart: util_1.composeFn(onTouchStart, this.handleMouseDown), onMouseMove: util_1.composeFn(onMouseMove, this.handleMouseMove), onTouchMove: util_1.composeFn(onTouchMove, this.handleMouseMove), onMouseUp: util_1.composeFn(onMouseUp, this.handleMouseUp), onTouchEnd: util_1.composeFn(onTouchEnd, this.handleMouseUp), ref: util_1.composeFn(ref, (ref) => {
                    this.canvasRef = ref;
                }), style: Object.assign({ width: this.state.canvasWidth, height: this.state.canvasHeight }, style) }, restProps);
        };
    }
    componentDidMount() {
        const { width, height, image } = this.props;
        setUpForCanvas();
        if (image) {
            const img = new Image();
            img.onload = () => {
                this.initializeCanvas(width, height, img);
                this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            };
            img.src = typeof image === 'string' ? image : util_1.fileToUrl(image);
        }
        else {
            this.initializeCanvas(width, height);
        }
    }
    componentWillUnmount() {
        cleanUpCanvas();
    }
    render() {
        const { render } = this.props;
        const canvasNode = React.createElement("canvas", Object.assign({ style: true }, this.getCanvasProps()));
        return typeof render === 'function'
            ? render({
                canvas: canvasNode,
                triggerSave: this.handleSave,
                getCanvasProps: this.getCanvasProps
            })
            : canvasNode;
    }
}
ReactPainter.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    render: PropTypes.func.isRequired,
    color: PropTypes.string,
    onSave: PropTypes.func,
    image: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.string])
};
ReactPainter.defaultProps = {
    color: '#000',
    image: undefined,
    onSave() {
        // noop
    }
};
exports.ReactPainter = ReactPainter;
//# sourceMappingURL=ReactPainter.js.map