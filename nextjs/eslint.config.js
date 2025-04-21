import { defineConfig } from 'eslint/config';

import globals from 'globals';

import js from '@eslint/js';
import ts from 'typescript-eslint';

import pluginHooks from 'eslint-plugin-react-hooks';
import pluginNext from '@next/eslint-plugin-next';
import pluginReact from 'eslint-plugin-react';
import pluginStylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    ignores: [
      '.history',
      'dist',
      'node_modules',
    ],
  },
  { settings: { react: { version: 'detect' } } },
  {
    plugins: {
      js,
      ts,
      stylistic: pluginStylistic,
    },
    extends: [
      'js/recommended',
      'ts/recommended',
      'stylistic/recommended',
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat['jsx-runtime'],
      pluginHooks.configs['recommended-latest'],
      pluginNext.flatConfig.recommended,
    ],
  },
  {
    files: [
      '**/*.{js,mjs,cjs,ts,tsx}',
    ],
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
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
        varsIgnorePattern: "^React$",
        ignoreRestSiblings: true,
      }],
      '@typescript-eslint/no-use-before-define': 'off',
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
      'no-duplicate-imports': 'error',
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-return-await': 'error',
      'no-trailing-spaces': 'warn',
      'no-underscore-dangle': 'off',
      'no-unneeded-ternary': 'error',
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
      'prefer-object-spread': 'error',
      'quote-props': ['error', 'as-needed'],
      '@stylistic/generator-star-spacing': 'off',
      '@stylistic/quote-props': ['error', 'as-needed'],
      quotes: ['warn', 'single'],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      'require-await': 'off',
      semi: ['error', 'always'],
      '@stylistic/semi': ['error', 'always'],
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
