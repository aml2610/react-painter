const dataUrlToArrayBuffer = (dataURI: string): [string, ArrayBuffer] => {
  const type = dataURI.match(/:([^}]*);/)[1];
  const byteString = atob(dataURI.split(',')[1]);
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return [type, ia.buffer];
};

const canvasToBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob> =>
  new Promise(resolve => {
    if (canvas.toBlob) {
      canvas.toBlob(blob => resolve(blob), type);
    } else {
      const dataURL = canvas.toDataURL(type);
      const [generatedType, buffer] = dataUrlToArrayBuffer(dataURL);
      resolve(new Blob([buffer], { type: generatedType }));
    }
  });

export { canvasToBlob };
