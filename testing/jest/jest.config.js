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

  // 测试覆盖率配置
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: '.coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    './src/**/*.ts': {
      branches: 40,
      statements: 40,
    },
  },
};
