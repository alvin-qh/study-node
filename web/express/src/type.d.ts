declare module 'express-sanitizer' {
  export { type NextHandleFunction } from 'connect';
  export default function sanitizer(): NextHandleFunction;
}

declare module 'express-minify-html' {
  export { type NextHandleFunction } from 'connect';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default function minifyHTML(opts: Record<string, any>): NextHandleFunction;
}
