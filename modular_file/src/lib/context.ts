import { IO } from './io';

export class Context {
  private _io: IO;

  constructor(io: IO) {
    this._io = io;
  }

  get io(): IO {
    return this._io;
  }
}
