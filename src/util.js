export function dataUrlToArrayBuffer(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return ia.buffer; // potential bug
}

export function fileToUrl(file) {
  const url = window.URL || window.webkitURL;

  try {
    return url.createObjectURL(file);
  } catch (e) {
    return '';
  }
}

export const canvasToBlob = (canvas, type) =>
  new Promise(resolve => {
    if (canvas.toBlob) {
      const result = new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob), type);
      });
      resolve(result);
    } else {
      const dataURL = canvas.toDataURL(type);
      const buffer = dataUrlToArrayBuffer(dataURL);
      resolve(new Blob([buffer], { type }));
    }
  });

export const composeFn = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));
