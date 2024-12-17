import { URL } from 'node:url';

export class Context {
  readonly request: Request;
  readonly url: URL;

  constructor(request: Request) {
    this.request = request;
    this.url = new URL(request.url);
  }

  get method(): string {
    return this.request.method;
  }
}
