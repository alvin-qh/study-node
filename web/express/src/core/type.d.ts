declare module "express-sanitizer" {
  import { NextHandleFunction } from "connect";
  export default function sanitizer(): NextHandleFunction;
}

declare module "express-minify-html" {
  import { NextHandleFunction } from "connect";
  export default function minifyHTML(opts: { [key: string]: any }): NextHandleFunction;
}
