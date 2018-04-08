"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataUrlToArrayBuffer = dataUrlToArrayBuffer;
exports.fileToUrl = fileToUrl;
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