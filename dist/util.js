"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dataUrlToArrayBuffer(dataURI) {
    var type = dataURI.match(/:([^}]*);/)[1];
    var byteString = atob(dataURI.split(',')[1]);
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return [type, ia.buffer]; // potential bug
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
            var _a = dataUrlToArrayBuffer(dataURL), generatedType = _a[0], buffer = _a[1];
            resolve(new Blob([buffer], { type: generatedType }));
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