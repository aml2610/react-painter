"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dataUrlToArrayBuffer(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return ia.buffer; // potential bug
}
exports.dataUrlToArrayBuffer = dataUrlToArrayBuffer;
function fileToUrl(file) {
    const url = window.URL || window.webkitURL;
    try {
        return url.createObjectURL(file);
    }
    catch (e) {
        return '';
    }
}
exports.fileToUrl = fileToUrl;
exports.canvasToBlob = (canvas, type) => new Promise(resolve => {
    if (canvas.toBlob) {
        canvas.toBlob(blob => resolve(blob), type);
    }
    else {
        const dataURL = canvas.toDataURL(type);
        const buffer = dataUrlToArrayBuffer(dataURL);
        resolve(new Blob([buffer], { type }));
    }
});
exports.composeFn = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));
//# sourceMappingURL=util.js.map