import { defineConfig } from 'eslint/config';

import globals from 'globals';

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    ignores: [
      'dist',
      '**/.history',
      'node_modules/',
    ],
  },
  {
    files: [
      '**/*.{js,mjs,cjs}',
    ],
    plugins: {
      js,
      stylistic,
    },
    extends: [
      'js/recommended',
      'stylistic/recommended',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2025,
        ...globals.mocha,
        ...globals.chai,
      },
      parser: js.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    rules: {
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
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
      'no-underscore-dangle': 'off',
      'object-curly-newline': ['error', {
        ExportDeclaration: {
          minProperties: 3,
          multiline: true,
        },
        ImportDeclaration: {
          minProperties: 5,
          multiline: true,
        },
        ObjectExpression: {
          minProperties: 4,
          multiline: true,
        },
        ObjectPattern: {
          minProperties: 3,
          multiline: true,
        },
      }],
      'quote-props': ['error', 'as-needed'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      quotes: ['warn', 'single', { avoidEscape: true }],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/generator-star-spacing': 'off',
      'sort-imports': ['warn', {
        allowSeparatedGroups: true,
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      }],
    },
  },
]);
