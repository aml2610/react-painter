type AnyFunction = (...params: any[]) => any;

const composeFn = (...fns: AnyFunction[]) => (...args: any[]) =>
  fns.forEach(fn => fn && fn(...args));

export { composeFn };
