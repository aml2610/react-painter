"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dataUrlToArrayBuffer(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return ia.buffer; // potential bug
}
exports.dataUrlToArrayBuffer = dataUrlToArrayBuffer;
function fileToUrl(file) {
    var url = window.URL || window.webkitURL;
    try {
        return url.createObjectURL(file);
    }
    catch (e) {
        return '';
    }
}
exports.fileToUrl = fileToUrl;
exports.canvasToBlob = function (canvas, type) {
    return new Promise(function (resolve) {
        if (canvas.toBlob) {
            canvas.toBlob(function (blob) { return resolve(blob); }, type);
        }
        else {
            var dataURL = canvas.toDataURL(type);
            var buffer = dataUrlToArrayBuffer(dataURL);
            resolve(new Blob([buffer], { type: type }));
        }
    });
};
exports.composeFn = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fns.forEach(function (fn) { return fn && fn.apply(void 0, args); });
    };
};
//# sourceMappingURL=util.js.map