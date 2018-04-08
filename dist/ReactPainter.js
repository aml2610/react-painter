"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactPainter = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var setUpForCanvas = function setUpForCanvas() {
  document.body.style.touchAction = "none";
};

var cleanUpCanvas = function cleanUpCanvas() {
  document.body.style.touchAction = null;
};

var ReactPainterContainer = function (_React$Component) {
  _inherits(ReactPainterContainer, _React$Component);

  function ReactPainterContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReactPainterContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactPainterContainer.__proto__ || Object.getPrototypeOf(ReactPainterContainer)).call.apply(_ref, [this].concat(args))), _this), _this.canvasRef = null, _this.ctx = null, _this.lastX = 0, _this.lastY = 0, _this.scalingFactor = 1, _this.state = {
      isDrawing: false
    }, _this.extractOffSetFromEvent = function (e) {
      var _e$nativeEvent = e.nativeEvent,
          offsetX = _e$nativeEvent.offsetX,
          offsetY = _e$nativeEvent.offsetY,
          touches = _e$nativeEvent.touches;

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
    }, _this.initializeCanvas = function (width, height, image) {
      if (image) {
        var _this$getDrawImageCan = _this.getDrawImageCanvasSize(width, height, image.naturalWidth, image.naturalHeight),
            _this$getDrawImageCan2 = _slicedToArray(_this$getDrawImageCan, 3),
            cvWidth = _this$getDrawImageCan2[0],
            cvHeight = _this$getDrawImageCan2[1],
            scalingRatio = _this$getDrawImageCan2[2];

        _this.canvasRef.width = image.naturalWidth;
        _this.canvasRef.height = image.naturalHeight;
        _this.canvasRef.style.width = cvWidth;
        _this.canvasRef.style.height = cvHeight;
        _this.scalingFactor = 1 / scalingRatio;
        console.log("image", image.naturalWidth, image.naturalHeight, "canvas", cvWidth, cvHeight, "ratio", _this.scalingFactor);
      } else {
        _this.canvasRef.width = width;
        _this.canvasRef.height = height;
      }
      _this.ctx = _this.canvasRef.getContext("2d");
      _this.ctx.strokeStyle = "#000";
      _this.ctx.lineWidth = 5 * _this.scalingFactor;
      _this.ctx.lineJoin = "round";
      _this.ctx.lineCap = "round";
    }, _this.getDrawImageCanvasSize = function (cWidth, cHeight, imageWidth, imageHeight) {
      if (imageWidth <= cWidth) {
        return [imageWidth, imageHeight, 1];
      }
      var scalingRatio = cWidth / imageWidth;
      return [cWidth, scalingRatio * imageHeight, scalingRatio];
    }, _this.handleMouseDown = function (e) {
      var _this$extractOffSetFr = _this.extractOffSetFromEvent(e),
          offsetX = _this$extractOffSetFr.offsetX,
          offsetY = _this$extractOffSetFr.offsetY;

      _this.lastX = offsetX;
      _this.lastY = offsetY;

      _this.setState({
        isDrawing: true
      });
    }, _this.handleMouseMove = function (e) {
      var color = _this.props.color;

      if (_this.state.isDrawing) {
        var _this$extractOffSetFr2 = _this.extractOffSetFromEvent(e),
            offsetX = _this$extractOffSetFr2.offsetX,
            offsetY = _this$extractOffSetFr2.offsetY;

        var ctx = _this.ctx;
        ctx.strokeStyle = color || "#000";
        var lastX = _this.lastX;
        var lastY = _this.lastY;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        _this.lastX = offsetX;
        _this.lastY = offsetY;
      }
    }, _this.handleMouseUp = function (e) {
      _this.setState({
        isDrawing: false
      });
    }, _this.handleSave = function () {
      var onSave = _this.props.onSave;

      (0, _util.canvasToBlob)(_this.canvasRef, "image/png").then(function (blob) {
        return onSave(blob);
      }).catch(function (err) {
        return console.error("in ReactPainter handleSave", err);
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReactPainterContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          width = _props.width,
          height = _props.height,
          image = _props.image;

      setUpForCanvas();
      if (image) {
        var img = new Image();
        img.onload = function () {
          _this2.initializeCanvas(width, height, img);
          _this2.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        };
        img.src = (0, _util.fileToUrl)(image);
      } else {
        this.initializeCanvas(width, height);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      cleanUpCanvas(this.eventListener);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var render = this.props.render;

      var canvasNode = _react2.default.createElement("canvas", {
        onMouseDown: this.handleMouseDown,
        onTouchStart: this.handleMouseDown,
        onMouseMove: this.handleMouseMove,
        onTouchMove: this.handleMouseMove,
        onMouseUp: this.handleMouseUp,
        onTouchEnd: this.handleMouseUp,
        ref: function ref(_ref2) {
          _this3.canvasRef = _ref2;
        }
      });
      return typeof render === "function" ? render(canvasNode, this.handleSave) : canvasNode;
    }
  }]);

  return ReactPainterContainer;
}(_react2.default.Component);

var ReactPainter = exports.ReactPainter = ReactPainterContainer;

exports.default = ReactPainter;