/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
export default {
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/dist/',
    '/.history/',
    '/node_modules/',
  ],
};
