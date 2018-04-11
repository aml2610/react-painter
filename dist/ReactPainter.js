"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var PropTypes = require("prop-types");
var React = require("react");
var util_1 = require("./util");
var setUpForCanvas = function () {
    document.body.style.touchAction = 'none';
};
var cleanUpCanvas = function () {
    document.body.style.touchAction = null;
};
var ReactPainter = /** @class */ (function (_super) {
    __extends(ReactPainter, _super);
    function ReactPainter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canvasRef = null;
        _this.ctx = null;
        _this.lastX = 0;
        _this.lastY = 0;
        _this.scalingFactor = 1;
        _this.state = {
            isDrawing: false,
            canvasWidth: 0,
            canvasHeight: 0
        };
        _this.extractOffSetFromEvent = function (e) {
            var _a = e.nativeEvent, offsetX = _a.offsetX, offsetY = _a.offsetY, touches = _a.touches;
            if (offsetX && offsetY) {
                return {
                    offsetX: offsetX * _this.scalingFactor,
                    offsetY: offsetY * _this.scalingFactor
                };
            }
            var rect = _this.canvasRef.getBoundingClientRect();
            var x = (touches[0].clientX - rect.left) * _this.scalingFactor;
            var y = (touches[0].clientY - rect.top) * _this.scalingFactor;
            return {
                offsetX: x,
                offsetY: y
            };
        };
        _this.initializeCanvas = function (width, height, image) {
            if (image) {
                var _a = _this.getDrawImageCanvasSize(width, height, image.naturalWidth, image.naturalHeight), cvWidth = _a[0], cvHeight = _a[1], scalingRatio = _a[2];
                _this.canvasRef.width = image.naturalWidth;
                _this.canvasRef.height = image.naturalHeight;
                _this.setState({
                    canvasWidth: cvWidth,
                    canvasHeight: cvHeight
                });
                _this.scalingFactor = 1 / scalingRatio;
            }
            else {
                _this.canvasRef.width = width;
                _this.canvasRef.height = height;
                _this.setState({
                    canvasWidth: width,
                    canvasHeight: height
                });
            }
            var _b = _this.props, color = _b.color, lineWidth = _b.lineWidth, lineJoin = _b.lineJoin, lineCap = _b.lineCap;
            _this.ctx = _this.canvasRef.getContext('2d');
            _this.ctx.strokeStyle = color;
            _this.ctx.lineWidth = lineWidth * _this.scalingFactor;
            _this.ctx.lineJoin = lineJoin;
            _this.ctx.lineCap = lineCap;
        };
        _this.getDrawImageCanvasSize = function (cWidth, cHeight, imageWidth, imageHeight) {
            if (imageWidth <= cWidth) {
                return [imageWidth, imageHeight, 1];
            }
            var scalingRatio = cWidth / imageWidth;
            return [cWidth, scalingRatio * imageHeight, scalingRatio];
        };
        _this.handleMouseDown = function (e) {
            var _a = _this.extractOffSetFromEvent(e), offsetX = _a.offsetX, offsetY = _a.offsetY;
            _this.lastX = offsetX;
            _this.lastY = offsetY;
            _this.setState({
                isDrawing: true
            });
        };
        _this.handleMouseMove = function (e) {
            var _a = _this.props, color = _a.color, lineWidth = _a.lineWidth, lineCap = _a.lineCap, lineJoin = _a.lineJoin;
            if (_this.state.isDrawing) {
                var _b = _this.extractOffSetFromEvent(e), offsetX = _b.offsetX, offsetY = _b.offsetY;
                var ctx = _this.ctx;
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth * _this.scalingFactor;
                ctx.lineCap = lineCap;
                ctx.lineJoin = lineJoin;
                var lastX = _this.lastX;
                var lastY = _this.lastY;
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(offsetX, offsetY);
                ctx.stroke();
                _this.lastX = offsetX;
                _this.lastY = offsetY;
            }
        };
        _this.handleMouseUp = function (e) {
            _this.setState({
                isDrawing: false
            });
        };
        _this.handleSave = function () {
            var onSave = _this.props.onSave;
            util_1.canvasToBlob(_this.canvasRef, 'image/png')
                .then(function (blob) { return onSave(blob); })
                .catch(function (err) { return console.error('in ReactPainter handleSave', err); });
        };
        _this.getCanvasProps = function (props) {
            if (props === void 0) { props = {}; }
            var onMouseDown = props.onMouseDown, onTouchStart = props.onTouchStart, onMouseMove = props.onMouseMove, onTouchMove = props.onTouchMove, onMouseUp = props.onMouseUp, onTouchEnd = props.onTouchEnd, style = props.style, ref = props.ref, restProps = __rest(props, ["onMouseDown", "onTouchStart", "onMouseMove", "onTouchMove", "onMouseUp", "onTouchEnd", "style", "ref"]);
            return __assign({ onMouseDown: util_1.composeFn(onMouseDown, _this.handleMouseDown), onTouchStart: util_1.composeFn(onTouchStart, _this.handleMouseDown), onMouseMove: util_1.composeFn(onMouseMove, _this.handleMouseMove), onTouchMove: util_1.composeFn(onTouchMove, _this.handleMouseMove), onMouseUp: util_1.composeFn(onMouseUp, _this.handleMouseUp), onTouchEnd: util_1.composeFn(onTouchEnd, _this.handleMouseUp), ref: util_1.composeFn(ref, function (ref) {
                    _this.canvasRef = ref;
                }), style: __assign({ width: _this.state.canvasWidth, height: _this.state.canvasHeight }, style) }, restProps);
        };
        return _this;
    }
    ReactPainter.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, width = _a.width, height = _a.height, image = _a.image;
        setUpForCanvas();
        if (image) {
            var img_1 = new Image();
            img_1.onload = function () {
                _this.initializeCanvas(width, height, img_1);
                _this.ctx.drawImage(img_1, 0, 0, img_1.naturalWidth, img_1.naturalHeight);
            };
            img_1.src = typeof image === 'string' ? image : util_1.fileToUrl(image);
        }
        else {
            this.initializeCanvas(width, height);
        }
    };
    ReactPainter.prototype.componentWillUnmount = function () {
        cleanUpCanvas();
    };
    ReactPainter.prototype.render = function () {
        var render = this.props.render;
        var canvasNode = React.createElement("canvas", __assign({ style: true }, this.getCanvasProps()));
        return typeof render === 'function'
            ? render({
                canvas: canvasNode,
                triggerSave: this.handleSave,
                getCanvasProps: this.getCanvasProps
            })
            : canvasNode;
    };
    ReactPainter.propTypes = {
        height: PropTypes.number,
        width: PropTypes.number,
        render: PropTypes.func,
        color: PropTypes.string,
        lineWidth: PropTypes.number,
        lineJoin: PropTypes.string,
        lineCap: PropTypes.string,
        onSave: PropTypes.func,
        image: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.string])
    };
    ReactPainter.defaultProps = {
        height: 300,
        width: 300,
        color: '#000',
        image: undefined,
        lineWidth: 5,
        lineJoin: 'round',
        lineCap: 'round',
        onSave: function () {
            // noop
        }
    };
    return ReactPainter;
}(React.Component));
exports.ReactPainter = ReactPainter;
//# sourceMappingURL=ReactPainter.js.map