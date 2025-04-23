import { defineConfig } from 'eslint/config';

import globals from 'globals';

import import_ from 'eslint-plugin-import';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    ignores: [
      '.history',
      'dist',
      'node_modules',
    ],
  },
  {
    files: [
      '**/*.{js,mjs,cjs,ts}',
    ],
    plugins: {
      '@stylistic': stylistic,
      import: import_,
    },
    extends: [
      '@stylistic/recommended',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2025,
        ...globals.jest,
      },
      parser: ts.parser,
      parserOptions: {
        parser: js.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    rules: {
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      }],
      'no-duplicate-imports': 'error',
      'no-return-await': 'error',
      'no-unneeded-ternary': 'error',
      'no-unused-vars': ['error', {
        args: 'none',
        ignoreRestSiblings: true,
      }],
      'prefer-object-spread': 'error',
      'sort-imports': ['warn', {
        allowSeparatedGroups: true,
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      }],
    },
  },
  {
    rules: {
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        imports: 'always-multiline',
        objects: 'always-multiline',
      }],
      '@stylistic/generator-star-spacing': 'off',
      '@stylistic/indent': ['warn', 2, { SwitchCase: 1 }],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/no-multiple-empty-lines': ['warn', {
        max: 2,
        maxEOF: 0,
      }],
      '@stylistic/no-param-reassign': 'off',
      '@stylistic/no-plusplus': 'off',
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/no-underscore-dangle': 'off',
      '@stylistic/no-use-before-define': 'off',
      '@stylistic/object-curly-newline': ['error', {
        ExportDeclaration: {
          minProperties: 3,
          multiline: true,
        },
        ImportDeclaration: {
          minProperties: 4,
          multiline: true,
        },
        ObjectExpression: {
          minProperties: 3,
          multiline: true,
        },
        ObjectPattern: {
          minProperties: 3,
          multiline: true,
        },
      }],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      '@stylistic/require-await': 'off',
      '@stylistic/semi': ['error', 'always'],
    },
  },
]);
