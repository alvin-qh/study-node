import { expect } from 'chai';

import { loadEnvVariables } from './config.ts';

describe('Test dotenv library', () => {
  beforeEach(() => {
    delete process.env.APP_USER;
    delete process.env.APP_VARIABLE;
  });

  it('should load env variables from `.env` file', () => {
    loadEnvVariables();

    expect(process.env.APP_USER).is.eq('dev-user');
    expect(process.env.APP_VARIABLE).is.eq('Develope dotenv by dev-user');
  });

  it('should load env variables from `.env.production` file', () => {
    loadEnvVariables({
      path: '.env.production'
    });

    expect(process.env.APP_USER).is.eq('prod-user');
    expect(process.env.APP_VARIABLE).is.eq('Production dotenv by prod-user');
  });
});
