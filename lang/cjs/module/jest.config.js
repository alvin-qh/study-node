/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/dist/',
    '/.history/',
    '/node_modules/',
  ],
};
