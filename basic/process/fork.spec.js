import { expect } from 'chai';

import { fileURLToPath } from 'node:url';
import { fork } from 'node:child_process';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("test 'fork' function", () => {
  /**
   *
   * @param {Array<string>} args 进程参数
   * @returns
   */
  async function startChildProcess(args) {
    return new Promise((resolve, reject) => {
      const childProcess = fork(path.join(__dirname, './child-process.js'), args || [], {
        env: { CHILD: '1' },
        silent: true,
      });

      childProcess.stdout.on('data', data => resolve(data.toString()));

      childProcess.on('error', reject);

      childProcess.on('exit', (code, signal) => {
        if (code !== 0) {
          reject(new Error(`Child process exited with code ${code} and signal ${signal}`));
        }
      });
    });
  }

  it('should fork child-process from js file', async () => {
    const result = await startChildProcess(['Alvin', '40']);
    expect(result).to.equal('Hello Child process\n');
  });
});
