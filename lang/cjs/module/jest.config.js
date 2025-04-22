/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/.history/',
    '/node_modules/',
    '/dist/',
  ],
};
