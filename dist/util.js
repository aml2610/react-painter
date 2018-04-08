"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var canvasToBlob = exports.canvasToBlob = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(canvas, type) {
    var result, dataURL, buffer;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!canvas.toBlob) {
              _context.next = 5;
              break;
            }

            result = new Promise(function (resolve) {
              canvas.toBlob(function (blob) {
                return resolve(blob);
              }, type);
            });
            return _context.abrupt("return", result);

          case 5:
            dataURL = canvas.toDataURL(type);
            buffer = dataUrlToArrayBuffer(dataURL);
            return _context.abrupt("return", new Blob([buffer], { type: type }));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function canvasToBlob(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.dataUrlToArrayBuffer = dataUrlToArrayBuffer;
exports.fileToUrl = fileToUrl;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function dataUrlToArrayBuffer(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return ia.buffer; // potential bug
}

function fileToUrl(file) {
  var url = window.URL || window.webkitURL;

  try {
    return url.createObjectURL(file);
  } catch (e) {
    return "";
  }
}