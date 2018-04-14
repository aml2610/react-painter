export declare function dataUrlToArrayBuffer(dataURI: string): [string, ArrayBuffer];
export declare const checkImageCrossOriginAllowed: (imageUrl: string) => Promise<{
    anonymous: boolean;
    withCredentials: boolean;
}>;
export declare function fileToUrl(file: File | Blob): string;
export declare function revokeUrl(objectUrl: string): void;
export declare const canvasToBlob: (canvas: HTMLCanvasElement, type: string) => Promise<Blob>;
export declare const composeFn: (...fns: ((...params: any[]) => any)[]) => (...args: any[]) => void;
export declare const makeAjaxHeadRequest: (url: string, withCredentials?: boolean) => Promise<any>;
