export function dataUrlToArrayBuffer(dataURI: string): [string, ArrayBuffer] {
  const type = dataURI.match(/:([^}]*);/)[1];
  const byteString = atob(dataURI.split(',')[1]);
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return [type, ia.buffer]; // potential bug
}

export const checkImageCrossOriginAllowed = (imageUrl: string): Promise<boolean> =>
  new Promise(resolve => {
    try {
      fetch(imageUrl, {
        method: 'HEAD'
      })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } catch (e) {
      resolve(false);
    }
  });

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
      const [generatedType, buffer] = dataUrlToArrayBuffer(dataURL);
      resolve(new Blob([buffer], { type: generatedType }));
    }
  });

type AnyFunction = (...params: any[]) => any;

export const composeFn = (...fns: AnyFunction[]) => (...args: any[]) =>
  fns.forEach(fn => fn && fn(...args));
