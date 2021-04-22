export interface ImportImageResponse {
  img: HTMLImageElement | ImageBitmap;
  imgWidth: number;
  imgHeight: number;
}
  
  export const makeAjaxHeadRequest = (
      url: string,
      withCredentials: boolean = false
    ): Promise < any > =>
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
  
  export const checkImageCrossOriginAllowed = (
      imageUrl: string
    ): Promise < {
      anonymous: boolean;withCredentials: boolean
    } > =>
    new Promise(resolve => {
      Promise.all(
          // have to map, else Promise.all would fail if any request fail
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
  
  export const fileToUrl = (file: File | Blob): string => {
    const url = window.URL || (window as any).webkitURL;
    try {
      return url.createObjectURL(file);
    } catch (e) {
      return '';
    }
  };
  
  export const importImage = (image: string | File): Promise < ImportImageResponse > =>
    new Promise((resolve, reject) => {
      if (typeof image === 'string') {
        const img = new Image();
        img.onload = () => {
          resolve({
            img,
            imgWidth: img.naturalWidth,
            imgHeight: img.naturalHeight
          });
        };
        checkImageCrossOriginAllowed(image).then(({
          anonymous,
          withCredentials
        }) => {
          if (anonymous || withCredentials) {
            img.crossOrigin = anonymous ? 'anonymous' : 'use-credentials';
            img.src = image;
          } else {
            reject();
          }
        });
      } else {
        if ('createImageBitmap' in window) {
          window
            .createImageBitmap(image)
            .then(img => resolve({
              img,
              imgWidth: img.width,
              imgHeight: img.height
            }))
            .catch(err => reject(err));
        } else {
          const img = new Image();
          img.onload = () => {
            resolve({
              img,
              imgWidth: img.naturalWidth,
              imgHeight: img.naturalHeight
            });
          };
          img.src = fileToUrl(image);
        }
      }
    });