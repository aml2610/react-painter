"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dataUrlToArrayBuffer(dataURI) {
    var type = dataURI.match(/:([^}]*);/)[1];
    var byteString = atob(dataURI.split(',')[1]);
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return [type, ia.buffer];
}
exports.dataUrlToArrayBuffer = dataUrlToArrayBuffer;
exports.checkImageCrossOriginAllowed = function (imageUrl) {
    return new Promise(function (resolve) {
        Promise.all(
        // have to map, else Promise.all would fail if any request fail
        [exports.makeAjaxHeadRequest(imageUrl), exports.makeAjaxHeadRequest(imageUrl, true)].map(function (promise) {
            return promise
                .then(function (result) { return ({ result: result, success: true }); })
                .catch(function (error) { return ({ error: error, success: false }); });
        }))
            .then(function (results) {
            return resolve({
                anonymous: results[0].success,
                withCredentials: results[1].success
            });
        })
            .catch(function () {
            return resolve({
                anonymous: false,
                withCredentials: false
            });
        });
    });
};
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
function revokeUrl(objectUrl) {
    try {
        window.URL.revokeObjectURL(objectUrl);
    }
    catch (e) {
        // fail silently because they is no major disruption to user exp
    }
}
exports.revokeUrl = revokeUrl;
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
exports.makeAjaxHeadRequest = function (url, withCredentials) {
    if (withCredentials === void 0) { withCredentials = false; }
    return new Promise(function (resolve, reject) {
        try {
            var request_1 = new XMLHttpRequest();
            request_1.open('HEAD', url);
            request_1.timeout = 1000;
            request_1.withCredentials = withCredentials;
            request_1.onreadystatechange = function () {
                if (request_1.readyState === 4) {
                    if (request_1.status === 200) {
                        resolve(request_1.response);
                    }
                    else {
                        reject(request_1.response);
                    }
                }
            };
            request_1.ontimeout = function () {
                reject('Timeout');
            };
            request_1.send();
        }
        catch (e) {
            reject(e);
        }
    });
};
//# sourceMappingURL=util.js.map