import { expect } from 'chai';

import { spawn } from 'node:child_process';

describe("test create sub-process by 'spawn'", () => {
  it('should start sub-process and read stdout', done => {
    const process = spawn('echo', ['-n', 'hello world']);

    process.stdout.on('data', data => {
      const out = data.toString('utf-8');
      expect(out).to.eq('hello world');
    });

    process.stderr.on('data', (/* data */) => {
      expect.fail();
    });

    process.on('close', code => {
      expect(code).to.eq(0);
      done();
    });
  });
});
