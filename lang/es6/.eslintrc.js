module.exports = {
  "env": {
    "es2021": true,
    "node": true,
    "mocha": true
  },
  "extends": "eslint:recommended",
  "overrides": [
    {
      "files": [
        "src/**/*.js",
        ".eslintrc.{js,cjs}"
      ],
      "rules": {
        "simple-import-sort/imports": "off"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "simple-import-sort"
  ],
  "rules": {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/quotes': ['warn', 'single'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
    // '@typescript-eslint/explicit-module-boundary-types': 'off',
    indent: ['warn', 2],
    'linebreak-style': ['error', 'unix'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: ['warn', 'single'],
    semi: ['error', 'always'],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
    'quote-props': ['error', 'as-needed'],
    'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
    'no-trailing-spaces': 'warn'
  }
}
