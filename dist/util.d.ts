export declare function dataUrlToArrayBuffer(dataURI: string): [string, ArrayBuffer];
export declare const checkImageCrossOriginAllowed: (imageUrl: string) => Promise<boolean>;
export declare function fileToUrl(file: File): string;
export declare const canvasToBlob: (canvas: HTMLCanvasElement, type: string) => Promise<Blob>;
export declare const composeFn: (...fns: ((...params: any[]) => any)[]) => (...args: any[]) => void;
