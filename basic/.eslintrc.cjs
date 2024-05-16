module.exports = {
  root: true,
  env: {
    es2021: true,
    browser: true
  },
  extends: [
    'airbnb-base',
    'prettier',
    'eslint:recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      },
      rules: {
        'simple-import-sort/imports': 'off'
      }
    },
    {
      files: [
        '*.test.js',
        '*.spec.js'
      ],
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'import',
    'prettier',
    'promise',
    'simple-import-sort'
  ],
  rules: {
    'comma-dangle': ['error', 'never'],
    'import/no-extraneous-dependencies': 'off',
    indent: ['warn', 2],
    'linebreak-style': ['error', 'unix'],
    'max-classes-per-file': ['error', 6],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-await': 'error',
    'no-trailing-spaces': 'warn',
    'no-underscore-dangle': 'off',
    'quote-props': ['error', 'as-needed'],
    quotes: ['warn', 'single'],
    semi: ['error', 'always'],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off'
  }
};
