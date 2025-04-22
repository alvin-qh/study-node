/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
export default {
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/.history/',
    '/node_modules/',
    '/dist/',
  ],
};
