export function dataUrlToArrayBuffer(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
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
    return "";
  }
}

export async function canvasToBlob(canvas, type) {
  if (canvas.toBlob) {
    const result = new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), type);
    });
    return result;
  } else {
    const dataURL = canvas.toDataURL(type);
    const buffer = dataUrlToArrayBuffer(dataURL);
    return new Blob([buffer], { type });
  }
}
