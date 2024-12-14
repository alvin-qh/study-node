/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      { useESM: true },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],

  // 对于 `import from` 中导入的内容进行映射
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // 将 `@/...` 映射为 `src/...`
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
