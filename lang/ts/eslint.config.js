import globals from 'globals';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        ...globals.chai,
      },
      parser: tsParser,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
      '@typescript-eslint/no-use-before-define': 'off',
        ignoreRestSiblings: true,
        args: 'none',
      }],
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
        imports: 'always-multiline',
        objects: 'always-multiline',
      }],
      'import/no-extraneous-dependencies': 'off',
      indent: ['warn', 2, { SwitchCase: 1 }],
      'linebreak-style': ['error', 'unix'],
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-return-await': 'error',
      'no-trailing-spaces': 'warn',
      'require-await': 'off',
      'no-duplicate-imports': 'error',
      'no-unneeded-ternary': 'error',
      'prefer-object-spread': 'error',
      'no-underscore-dangle': 'off',
      'object-curly-newline': ['error', {
        ExportDeclaration: {
          minProperties: 3,
          multiline: true,
        },
        ImportDeclaration: 'never',
        ObjectExpression: {
          minProperties: 3,
          multiline: true,
        },
        ObjectPattern: {
          minProperties: 3,
          multiline: true,
        },
      }],
      'quote-props': ['error', 'as-needed'],
      quotes: ['warn', 'single'],
      semi: ['error', 'always'],
      'sort-imports': ['warn', {
        allowSeparatedGroups: true,
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      }],
      'sort-keys': ['warn', 'asc', {
        caseSensitive: true, minKeys: 2, natural: true,
      }],
    },
  },
];
