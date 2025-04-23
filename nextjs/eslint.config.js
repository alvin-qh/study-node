import { defineConfig } from 'eslint/config';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import globals from 'globals';

import import_ from 'eslint-plugin-import';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin';
import ts from 'typescript-eslint';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '.history',
      '.next',
      'dist',
      'node_modules',
    ],
  },
  { settings: { react: { version: 'detect' } } },
  {
    plugins: {
      '@stylistic': stylistic,
      import: import_,
    },
    extends: [
      '@stylistic/recommended',
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
    ],
  },
  {
    files: [
      '**/*.{js,mjs,cjs,ts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2025,
        ...globals.browser,
        ...globals.serviceworker,
      },
      parser: ts.parser,
      parserOptions: {
        parser: js.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'none',
        ignoreRestSiblings: true,
        ignoreRestSiblings: true,
        varsIgnorePattern: '^React$',
      }],
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
        ignoreRestSiblings: true,
        varsIgnorePattern: '^React$',
      }],
      'no-use-before-define': 'off',
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
        functions: 'never',
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
      '@stylistic/object-curly-newline': ['error', {
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
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      '@stylistic/require-await': 'off',
      '@stylistic/semi': ['error', 'always'],
    },
  },
]);
