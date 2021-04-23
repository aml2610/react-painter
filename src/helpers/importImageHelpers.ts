import { fileToUrl } from './objectUrlHelpers';

interface ImportImageResponse {
  img: HTMLImageElement | ImageBitmap;
  imgWidth: number;
  imgHeight: number;
}

const makeAjaxHeadRequest = (
  url: string,
  withCredentials: boolean = false
): Promise<any> =>
  new Promise((resolve, reject) => {
    try {
      const request = new XMLHttpRequest();
      request.open('HEAD', url);
      request.timeout = 1000;
      request.withCredentials = withCredentials;
      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          if (request.status === 200) {
            resolve(request.response);
          } else {
            reject(request.response);
          }
        }
      };
      request.ontimeout = () => {
        reject('Timeout');
      };
      request.send();
    } catch (e) {
      reject(e);
    }
  });

const checkImageCrossOriginAllowed = (
  imageUrl: string
): Promise<{
  anonymous: boolean;
  withCredentials: boolean;
}> =>
  new Promise(resolve => {
    Promise.all(
      // First try without credentials, then with credentials
      // (at the end report which one of the two works - it can be both)
      // Have to map, else Promise.all would fail if any request fail
      [makeAjaxHeadRequest(imageUrl), makeAjaxHeadRequest(imageUrl, true)].map(promise =>
        promise
          .then(result => ({
            result,
            success: true
          }))
          .catch(error => ({
            error,
            success: false
          }))
      )
    )
      .then(results =>
        resolve({
          anonymous: results[0].success,
          withCredentials: results[1].success
        })
      )
      .catch(() =>
        resolve({
          anonymous: false,
          withCredentials: false
        })
      );
  });

const importImageFromUrl = (url: string): Promise<ImportImageResponse> => {
  const img = new Image();
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve({
        img,
        imgWidth: img.naturalWidth,
        imgHeight: img.naturalHeight
      });
    };
    checkImageCrossOriginAllowed(url).then(({ anonymous, withCredentials }) => {
      if (anonymous || withCredentials) {
        img.crossOrigin = anonymous ? 'anonymous' : 'use-credentials';
        img.src = url;
      } else {
        reject();
      }
    });
  });
};

const importImageFromBitmapSrc = (bitmapSrc: File): Promise<ImportImageResponse> =>
  new Promise((resolve, reject) => {
    window
      .createImageBitmap(bitmapSrc)
      .then(img =>
        resolve({
          img,
          imgWidth: img.width,
          imgHeight: img.height
        })
      )
      .catch(err => reject(err));
  });

const importImageFromFile = (file: File): Promise<ImportImageResponse> => {
  const img = new Image();
  return new Promise(resolve => {
    img.onload = () => {
      resolve({
        img,
        imgWidth: img.naturalWidth,
        imgHeight: img.naturalHeight
      });
    };
    img.src = fileToUrl(file);
  });
};

const importImage = (image: string | File): Promise<ImportImageResponse> => {
  if (typeof image === 'string') {
    return importImageFromUrl(image);
  } else if ('createImageBitMap' in window) {
    return importImageFromBitmapSrc(image);
  } else {
    return importImageFromFile(image);
  }
};

export { importImage };
