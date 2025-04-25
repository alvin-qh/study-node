/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/.history/',
    '/dist/',
    '/node_modules/',
  ],
};
