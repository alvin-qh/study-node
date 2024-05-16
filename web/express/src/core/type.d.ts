declare module 'express-sanitizer' {
  import { type NextHandleFunction } from 'connect';

  export default function sanitizer(): NextHandleFunction;
}

declare module 'express-minify-html' {
  import { type NextHandleFunction } from 'connect';

  export default function minifyHTML(opts: Record<string, any>): NextHandleFunction;
}
