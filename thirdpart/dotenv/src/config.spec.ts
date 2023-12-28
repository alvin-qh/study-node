import { expect } from 'chai';

import { loadEnvVariables } from './config';

describe('Test dotenv library', () => {
  it('should load env variables from `.env` file', () => {
    loadEnvVariables();

    expect(process.env.APP_USER).is.eq('prod-user');
    expect(process.env.APP_VARIABLE).is.eq('Test production dotenv by prod-user');
  });

  it('should load env variables from `.test.env` file', () => {
    loadEnvVariables({
      path: '.test.env'
    });

    expect(process.env.APP_USER).is.eq('prod-user');

    expect(process.env.TEST_USER).is.eq('test-user');
    expect(process.env.TEST_VARIABLE).is.eq('Test testing dotenv by test-user');
  });
});
