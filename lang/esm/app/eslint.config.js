import { defineConfig } from 'eslint/config';

import globals from 'globals';

import import_ from 'eslint-plugin-import';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

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
      '**/*.{js,mjs,cjs}',
    ],
    plugins: {
      import: import_,
      '@stylistic': stylistic,
    },
    extends: [
      '@stylistic/recommended',
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
      // 检测不需要的依赖项
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      }],
      // 不允许有重复的导入项
      'no-duplicate-imports': 'error',
      // 不允许在 return 关键字后跟随 await 关键字
      'no-return-await': 'error',
      // 禁止三元运算符
      'no-unneeded-ternary': 'error',
      // 禁止在 ts 中包含未使用变量
      'no-unused-vars': ['error', {
        args: 'none',
        ignoreRestSiblings: true,
      }],
      // 优先使用对象扩展而不是 `Object.assign`
      'prefer-object-spread': 'error',
      // 对导入项进行排序
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
        ImportDeclaration: {
          minProperties: 5,
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
      '@stylistic/semi': ['error', 'always'],
    },
  },
]);
