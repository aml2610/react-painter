export function revokeUrl(objectUrl: string): void {
  try {
    window.URL.revokeObjectURL(objectUrl);
  } catch (e) {
    // fail silently because they is no major disruption to user exp
  }
}

type AnyFunction = (...params: any[]) => any;

export const composeFn = (...fns: AnyFunction[]) => (...args: any[]) =>
  fns.forEach(fn => fn && fn(...args));
