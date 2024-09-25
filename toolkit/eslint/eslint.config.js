/// ESlint 9.x for Vue3
import { FlatCompat } from "@eslint/eslintrc";
import js from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import vueEslintParser from 'vue-eslint-parser';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

// 导出 ESLint 配置
export default [
  // 继承 JS 默认配置
  js.configs.recommended,

  ...compat.extends('eslint-config-airbnb-base'),

  // 继承 TS 默认配置
  ...tsEslint.configs.recommended,

  // 继承 VUE 默认配置
  ...pluginVue.configs['flat/essential'],

  // 本项目配置
  {
    // 要检查的文件列表
    files: [
      '**/*.vue',
      '**/*.ts',
      '**/*.js'
    ],

    // 语言语法相关配置
    languageOptions: {
      // 全局配置
      globals: {
        // 继承浏览器语法配置
        ...globals.browser,

        // 标准 ES 语法配置
        ...globals.es2020,

        // NodeJS 相关语法配置
        ...globals.node,
      },

      // 定义 ES 标准的版本
      ecmaVersion: 2020,

      // 定义主语法解析器
      parser: vueEslintParser,

      // 语法解析器配置项
      parserOptions: {
        // 定义次级语法解析器
        parser: tsEslint.parser,

        // 支持 JSX 语法
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 12,
        sourceType: 'module',

        // 定义 ts 配置文件
        project: ['tsconfig.json'],

        // 定义扩展名
        extraFileExtensions: [
          '.vue'
        ]
      },
    },

    // 定义额外的插件
    plugins: {
      'simple-import-sort': pluginSimpleImportSort,
      'eslint-plugin-prettier': pluginPrettier
    },

    // 定义语法检查规则
    rules: {
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/indent': ['warn', 2, { SwitchCase: 0 }],
      '@typescript-eslint/quotes': ['warn', 'single'],
      '@typescript-eslint/semi': ['error', 'always'],
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/return-await': 'error',
      'class-methods-use-this': 'off',
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'indent': 'off',
      'linebreak-style': ['error', 'unix'],
      'max-classes-per-file': 'off',
      'max-len': ['error', { code: 120, ignoreComments: true }],
      'n/no-callback-literal': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
      'no-param-reassign': 'off',
      'no-restricted-syntax': 'off',
      'no-return-await': 'off',
      'no-trailing-spaces': 'warn',
      'no-plusplus': 'off',
      'no-underscore-dangle': 'off',
      'quote-props': ['error', 'as-needed'],
      'quotes': ['warn', 'single'],
      'semi': ['error', 'always'],
      'sort-imports': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'quote-props': ['error', 'as-needed'],
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
      'no-trailing-spaces': 'warn',
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 6
        },
        multiline: {
          max: 1
        }
      }]
    }
  }
];
