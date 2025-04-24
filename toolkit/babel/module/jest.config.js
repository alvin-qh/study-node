/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
module.exports = {
  testEnvironment: 'node',
  transform: { '\\.[jt]sx?$': 'babel-jest' },
  testPathIgnorePatterns: [
    '/.history/',
    '/dist/',
    '/node_modules/',
  ],
};
