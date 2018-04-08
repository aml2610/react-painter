export declare function dataUrlToArrayBuffer(dataURI: string): ArrayBuffer;
export declare function fileToUrl(file: File): string;
export declare const canvasToBlob: (canvas: HTMLCanvasElement, type: string) => Promise<Blob>;
export declare const composeFn: (...fns: Function[]) => (...args: any[]) => void;
