'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataUrlToArrayBuffer = dataUrlToArrayBuffer;
exports.fileToUrl = fileToUrl;
function dataUrlToArrayBuffer(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
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
    return '';
  }
}

var canvasToBlob = exports.canvasToBlob = function canvasToBlob(canvas, type) {
  return new Promise(function (resolve) {
    if (canvas.toBlob) {
      var result = new Promise(function (resolve) {
        canvas.toBlob(function (blob) {
          return resolve(blob);
        }, type);
      });
      resolve(result);
    } else {
      var dataURL = canvas.toDataURL(type);
      var buffer = dataUrlToArrayBuffer(dataURL);
      resolve(new Blob([buffer], { type: type }));
    }
  });
};

var composeFn = exports.composeFn = function composeFn() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return fns.forEach(function (fn) {
      return fn && fn.apply(undefined, args);
    });
  };
};