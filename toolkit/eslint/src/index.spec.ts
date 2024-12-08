import { expect } from 'chai';

import { main } from './index';

describe('test `index` module', () => {
  it('should `main` function worked', () => {
    let logContent: string = '';

    const srcConsoleLog = console.log;

    console.log = (s) => {
      logContent = s;
    };

    try {
      main();
    }
    finally {
      console.log = srcConsoleLog;
    }

    expect(logContent).to.eq('Hello ESLint!!');
  });
});
