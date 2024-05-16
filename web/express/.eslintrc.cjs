module.exports = {
  root: true,
  env: {
    es2021: true,
    browser: true
  },
  extends: [
    'airbnb-base',
    'prettier',
    'standard-with-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
    {
      files: [
        '.eslintrc.{js,cjs}'
      ],
      env: {
        node: true
      },
      parserOptions: {
        sourceType: 'script'
      },
      rules: {
        'simple-import-sort/imports': 'off'
      }
    },
    {
      files: [
        'src/**/*.{ts,js}'
      ],
      env: {
        node: true
      }
    },
    {
      files: [
        '*.spec.{js,ts}'
      ],
      env: {
        node: true,
        mocha: true
      },
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json']
  },
  plugins: [
    'simple-import-sort',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/quotes': ['warn', 'single'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/indent': ['warn', 2, { SwitchCase: 0 }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    indent: ['warn', 2, { SwitchCase: 0 }],
    'linebreak-style': ['error', 'unix'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: ['warn', 'single'],
    semi: ['error', 'always'],
    'import/no-extraneous-dependencies': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
    'quote-props': ['error', 'as-needed'],
    'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
    'no-trailing-spaces': 'warn',
    'no-plusplus': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': ['error', 'never', { js: 'always' }],
    'no-param-reassign': 'off'
  }
};
