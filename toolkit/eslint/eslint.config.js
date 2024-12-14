import globals from 'globals';

import jslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import stylisticPlugin from '@stylistic/eslint-plugin';
import vuePlugin from 'eslint-plugin-vue';

import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';

const USE_PARSER = 'ts';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 继承建议的 js 语法检测配置
  jslint.configs.recommended,

  // 继承建议的 stylistic 插件配置
  stylisticPlugin.configs.customize(),

  // 继承建议的 ts 语法检测配置
  ...tseslint.configs.recommended,

  // 继承建议的 vue 插件配置
  ...vuePlugin.configs['flat/recommended'],

  // 待检测文件配置
  {
    // 指定要进行 lint 检测的代码路径和文件类型
    files: [
      '**/*.ts',
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
    ],
  },

  // 忽略文件配置
  {
    ignores: [
      'dist',
      '.history',
      'node_modules',
    ],
  },

  // 检测规则配置
  {
    // 设置语言检测定义
    languageOptions: {
      // 全局配置
      globals: {
        ...globals.node, // 引入 node 配置
        ...globals.mocha, // 引入 mocha 测试框架配置
        ...globals.chai, // 引入 chai 断言库配置
      },

      // 设置语法解析器
      parser: USE_PARSER == 'vue' ? vueParser : USE_PARSER == 'ts' ? tsParser : undefined,

      // 设置解析器选项
      parserOptions: {
        ...reactPlugin.configs['jsx-runtime'].parserOptions,

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

    // 插件配置
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      vue: vuePlugin,
    },

    // 设置语法检测规则
    rules: {
      // 继承 React 插件推荐规则
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // 禁止使用 console
      'no-console': 'off',

      // 禁止使用 debugger
      'no-debugger': 'off',

      // 禁止在 ts 中包含未使用变量
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'none',
        ignoreRestSiblings: true,
      }],

      // 禁止在 ts 中在定义前使用
      '@typescript-eslint/no-use-before-define': 'off',

      // 定义
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
        imports: 'always-multiline',
        objects: 'always-multiline',
      }],

      //
      'import/no-extraneous-dependencies': 'off',

      // 定义缩进规则, 缩进为 2 空格
      indent: ['warn', 2, {
        // 定义 switch 语句中 case 子句的缩进规则
        SwitchCase: 1,
      }],

      // 定义每行结束样式, 使用 unix 行结尾
      'linebreak-style': ['error', 'unix'],

      // 不允许有重复的导入项
      'no-duplicate-imports': 'error',

      // 定义连续空行的数量规则
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],

      // 禁止对函数参数再赋值
      'no-param-reassign': 'off',

      // 允许使用 ++ 或 -- 运算符
      'no-plusplus': 'off',

      // 不允许在 return 关键字后跟随 await 关键字
      'no-return-await': 'error',

      // 行结尾出现空格字符时给出警告
      'no-trailing-spaces': 'warn',

      // 允许标识符中有悬空下划线
      'no-underscore-dangle': 'off',

      // 禁止三元运算符
      'no-unneeded-ternary': 'error',

      // 定义换行规范
      'object-curly-newline': ['error', {
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

      // 优先使用对象扩展而不是 `Object.assign`
      'prefer-object-spread': 'error',

      // 要求对象字面量属性名称仅在需要时使用引号, 例如 { 'my-name': 1 }
      'quote-props': ['error', 'as-needed'],
      '@stylistic/quote-props': ['error', 'as-needed'],

      // 建议字符串使用单引号
      quotes: ['warn', 'single', { avoidEscape: true }],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],

      // 禁止使用不带 await 表达式的 async 函数
      'require-await': 'off',

      // 语句必须使用分号结尾
      semi: ['error', 'always'],
      '@stylistic/semi': ['error', 'always'],

      // 定义导入模块排序规则
      'sort-imports': ['warn', {
        // 允许导入分组
        allowSeparatedGroups: true,

        // 禁止忽略大小写排序
        ignoreCase: false,

        // 禁止忽略 import 声明语句的排序
        ignoreDeclarationSort: false,

        // 忽略有多个成员的 import 声明的排序
        ignoreMemberSort: false,

        // 设置多个成员导入的顺序规则
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      }],
    },
  },
];
