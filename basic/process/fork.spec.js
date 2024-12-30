import { expect } from 'chai';

import { startChildProcess } from './child-process.js';

describe("test create node sub-process by 'fork'", () => {
  it('should start sub-process', async () => {
    const result = await startChildProcess();
    expect(result).to.eq('OK');
  });
});
