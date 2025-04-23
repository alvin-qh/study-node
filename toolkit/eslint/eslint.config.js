import { defineConfig } from 'eslint/config';

import globals from 'globals';

import import_ from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import stylistic from '@stylistic/eslint-plugin';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';

import vueParser from 'vue-eslint-parser';

const USE_PARSER = 'ts';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  // 忽略文件配置
  // 该配置项必须独立, 不能和其它配置项在一个代码块中
  {
    ignores: [
      'dist',
      '.history',
      'node_modules',
    ],
  },

  // 插件和集成项
  {
    // 指定要进行 lint 检测的代码路径和文件类型
    files: [
      '**/*.{js,mjs,cjs,ts}',
    ],

    // 设置插件
    plugins: {
      '@stylistic': stylistic,
      import: import_,
      'react-hooks': reactHooks,
      vue: vue,
    },

    // 设置继承项
    extends: [
      '@stylistic/recommended',
      'vue/flat/essential',
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
    ],
  },

  // 语法检测设置
  { settings: { react: { version: 'detect' } } },

  // 语法检测选项
  {
    // 设置语言检测定义
    languageOptions: {
      // 全局配置
      globals: {
        ...globals.node,
        ...globals.es2025,
        ...globals.browser,
        ...globals.serviceworker,
        ...globals.jest,
      },

      // 设置语法解析器
      parser: USE_PARSER == 'vue' ? vueParser : USE_PARSER == 'ts' ? ts.parser : undefined,

      // 设置解析器选项
      parserOptions: {
        // 设计二级语法解析
        parser: ts.parser,
        // 设置 ECMAScript 版本
        ecmaVersion: 'latest',
        // 设置源码类型, 可以设置为 module 或 commonjs
        sourceType: 'module',
        // 允许解析 JSX
        ecmaFeatures: { jsx: true },
      },

      // 设置源码类型, 可以设置为 module 或 commonjs
      sourceType: 'module',
    },
  },

  // 通用语法规则
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

  // `stylistic` 语法规则
  {
    // 设置语法检测规则
    rules: {
      // 定义代码结尾是否需要增加逗号
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
        imports: 'always-multiline',
        objects: 'always-multiline',
      }],
      // 定义缩进规则, 缩进为 2 空格
      '@stylistic/indent': ['warn', 2, {
        // 定义 switch 语句中 case 子句的缩进规则
        SwitchCase: 1,
      }],
      // 定义每行结束样式, 使用 unix 行结尾
      '@stylistic/linebreak-style': ['error', 'unix'],
      // 禁止使用 console
      '@stylistic/no-console': 'off',
      // 禁止使用 debugger
      '@stylistic/no-debugger': 'off',
      // 定义连续空行的数量规则
      '@stylistic/no-multiple-empty-lines': ['warn', {
        max: 2,
        maxEOF: 0,
      }],
      // 禁止对函数参数再赋值
      '@stylistic/no-param-reassign': 'off',
      // 允许使用 ++ 或 -- 运算符
      '@stylistic/no-plusplus': 'off',
      // 行结尾出现空格字符时给出警告
      '@stylistic/no-trailing-spaces': 'warn',
      // 允许标识符中有悬空下划线
      '@stylistic/no-underscore-dangle': 'off',
      // 禁止在 ts 中在定义前使用
      '@stylistic/no-use-before-define': 'off',
      // 定义换行规范
      '@stylistic/object-curly-newline': ['error', {
        // 定义 export 语句的换行规范
        ExportDeclaration: {
          minProperties: 3,
          multiline: true,
        },
        // 定义 import 语句的换行规范
        ImportDeclaration: {
          minProperties: 5,
          multiline: true,
        },
        // 定义对象声明语句的换行规范
        ObjectExpression: {
          minProperties: 3,
          multiline: true,
        },
        // 定义对象声明语句的换行规范
        ObjectPattern: {
          minProperties: 3,
          multiline: true,
        },
      }],
      // 要求对象字面量属性名称仅在需要时使用引号, 例如 { 'my-name': 1 }
      '@stylistic/quote-props': ['error', 'as-needed'],
      // 建议字符串使用单引号
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      // 禁止使用不带 await 表达式的 async 函数
      '@stylistic/require-await': 'off',
      // 语句必须使用分号结尾
      '@stylistic/semi': ['error', 'always'],
    },
  },
]);
