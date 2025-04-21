import { defineConfig } from 'eslint/config';

import globals from 'globals';

import js from '@eslint/js';
import ts from 'typescript-eslint';

import hooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import stylisticPlugin from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  js.configs.recommended,
  ...ts.configs.recommended,
  stylisticPlugin.configs.customize(),
  {
    ignores: [
      '.history',
      'dist',
      'node_modules',
    ],
  },
  {
    files: [
      '**/*.{js,mjs,cjs,ts,tsx}'
    ],
    plugins: {
      js,
      ts,
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      '@next/next': nextPlugin,
    },
    extends: [
      'js/recommended',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2025,
        ...globals.mocha,
        ...globals.chai,
      },
      parser: ts.parser,
      parserOptions: {
        parser: js.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'none',
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
