import { describe, expect, it } from 'bun:test';

import { welcome } from './index';

describe('Test `index` module', () => {
  it('should `welcome` function return correct answer', () => {
    expect(welcome()).toEqual('Welcome to Bun script');
  });
});
