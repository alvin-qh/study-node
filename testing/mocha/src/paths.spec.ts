import { expect } from 'chai';

import { tryCoverage } from '@/index';

/**
 * 测试 Mocha 对 Typescript 路径别名的支持
 */
describe('Test typescript path alias', () => {
  /**
   * Mocha 通过 `tsconfig-paths/register` 插件对 Typescript 别名进行支持
   *
   * 参见: `.mocharc.json` 配置 Mocha 插件
   * 参见: `tsconfig.json` 配置 `paths` 路径别名
   */
  it('should `@app` path alias worked', () => {
    const r = tryCoverage(2, 3);
    expect(r).is.eq(5);
  });
});
