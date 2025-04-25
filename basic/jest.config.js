/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
export default {
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/.history/',
    '/dist/',
    '/node_modules/',
  ],
};
