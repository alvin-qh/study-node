/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
export default {
  rootDir: './src',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      { useESM: true },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    '/.history/',
    '/dist/',
    '/node_modules/',
  ],
  maxWorkers: 1,
  setupFilesAfterEnv: ['jest-extended/all'],
};
