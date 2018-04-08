export function dataUrlToArrayBuffer(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return ia.buffer; // potential bug
}

export function fileToUrl(file: File): string {
  const url = window.URL || (window as any).webkitURL;

  try {
    return url.createObjectURL(file);
  } catch (e) {
    return '';
  }
}

export const canvasToBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob> =>
  new Promise(resolve => {
    if (canvas.toBlob) {
      canvas.toBlob(blob => resolve(blob), type);
    } else {
      const dataURL = canvas.toDataURL(type);
      const buffer = dataUrlToArrayBuffer(dataURL);
      resolve(new Blob([buffer], { type }));
    }
  });

export const composeFn = (...fns: Function[]) => (...args: any[]) =>
  fns.forEach(fn => fn && fn(...args));
