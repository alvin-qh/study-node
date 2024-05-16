module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    mocha: true
  },
  extends: [
    'airbnb-base',
    'prettier',
    'eslint:recommended'
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
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'simple-import-sort',
    'prettier'
  ],
  rules: {
    indent: ['warn', 2],
    'linebreak-style': ['error', 'unix'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
    'no-trailing-spaces': 'warn',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    quotes: ['warn', 'single'],
    semi: ['error', 'always'],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
    'quote-props': ['error', 'as-needed']
  }
};
