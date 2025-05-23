# Typescript 编译选项

通过 `tsc` 命令进行编译时, 其编译配置文件 (默认为 `tsconfig.json`) 可以如下:

```json
{
  /* 根选项 */
  "include": ["./src/**/*.ts"],      // 指定被编译文件所在的目录
  "exclude": ["./src/**/*.spec.ts"], // 指定不需要被编译的目录

  /* 编译选项 */
  "compilerOptions": {
    "target": "ES6",      // 指定编译后的 JS 版本
    "module": "commonjs", // 指定编译后的 JS 规范, 可以为 CommonJS 和 Module
    "lib": [              // TS需要引用的库
      "DOM",
      "ES5",
      "ES6",
      "ES7",
      "ScriptHost"
    ],
    "outDir": "./dist",  // 指定输出目录
    "rootDir": "./",     // 指定输出文件目录(用于输出), 用于控制输出目录结构
    "allowJs": true,     // 允许编译器编译 .js, .jsx 文件
    "checkJs": true,     // 允许在 .js 文件中报错, 通常与 allowJS 一起使用
    "removeComments": true,  // 删除注释
    "esModuleInterop": true, // 允许通过 module.exports 导出的模块通过 import 导入

    /* 严格检查选项 */
    "strict": true,         // 开启所有严格的类型检查
    "alwaysStrict": true,   // 在代码中注入 'use strict'
    "noImplicitAny": true,  // 不允许隐式的 any 类型
    "noImplicitThis": true, // 不允许 this 有隐式的 any 类型
    "strictNullChecks": true,    // 不允许把 null, undefined 赋值给其他类型的变量
    "strictBindCallApply": true, // 严格的 bind/call/apply 检查
    "strictFunctionTypes": true, // 不允许函数参数双向协变
    "strictPropertyInitialization": true, // 类的实例属性必须初始化

    /* 额外检查 */
    "noUnusedLocals": true,     // 是否检查未使用的局部变量
    "noUnusedParameters": true, // 是否检查未使用的参数
    "noImplicitReturns": true,  // 检查函数是否不含有隐式返回值
    "noImplicitOverride": true, // 是否检查子类继承自基类时, 其重载的函数命名与基类的函数不同步问题
    "noFallthroughCasesInSwitch": true, // 检查 switch 中是否含有 case 没有使用 break 跳出
    "noUncheckedIndexedAccess": true,   // 是否通过索引签名来描述对象上有未知键但已知值的对象
    "noPropertyAccessFromIndexSignature": true, //是否通过 . 语法访问对象字段和数组索引, 以及在类型中声明属性的方式之间的一致性

    /* 实验选项 */
    "experimentalDecorators": true, // 是否启用对装饰器的实验性支持
    "emitDecoratorMetadata": true,  // 为装饰器启用对发出类型元数据的实验性支持

    /* 高级选项 */
    "forceConsistentCasingInFileNames": true, // 是否区分文件系统大小写规则
    "extendedDiagnostics": false, // 是否查看编译时花费的时间
    "noEmitOnError": true,        // 有错误时不进行编译
    "resolveJsonModule": true,    // 是否解析 JSON 模块
  },
}
```

完整的编译选项包括:

## 根选项

- `include`: 指定被编译文件所在的目录
- `exclude`: 指定不需要被编译的目录
- `extends`: 指定要继承的配置文件
- `files`: 指定被编译的文件
- `references`: 项目引用, 是 Typescript 3.0 中的一项新功能, 它允许将程序组织成更小的部分
- `compilerOptions`: 定义编译选项

## 编译选项

### 通用编译选项

- `incremental`: 是否启用增量编译, 指再次编译时只编译增加的内容, 默认: `false`
- `target`: 指定编译成 ES 的版本
- `module`: 指定编译后代码使用的模块化规范, 可以为 `commonjs` 或 `module`
- `lib`: 指定项目运行时使用的库
- `outDir`: 指定编译后文件所在目录
- `outFile`: 将代码编译合并成一个文件, 默认将所有全局作用域中的代码合并成一个文件
- `rootDir`: 指定输入文件的根目录, 默认情况下当前的项目目录为根目录
- `allowJs`: 是否对js文件进行编译, 默认: `false`
- `checkJs`: 是否检查js代码是否符合语法规范, 当使用 `checkJs` 时, 必须使用 `allowJs`, 默认: `false`
- `removeComments`: 是否移除注释, 默认: `false`
- `noEmit`: 执行编译过程, 但不生成编译后的文件, 默认: `false`
- `jsx`: 指定 JSX 代码生成用于的开发环境
- `plugins`: 使用的编译插件列表
- `declaration`: 是否生成相应的 `.d.ts` 声明文件, 默认: `false`
- `declarationMap`: 是否为每个对应的 `.d.ts` 文件生成一个源代码映射文件, 使用该功能时, 需要 `declaration` 或 `composite` 配合一起使用, 默认: `false`
- `sourceMap`: 是否生成相应的源代码映射的文件, 默认: `false`
- `composite`: 是否开启项目编译, 开启该功能, 将会生成被编译文件所在的目录, 同时开启 `declaration`, `declarationMap和incremental`, 默认: `false`
- `tsBuildInfoFile`: 指定增量编译信息文件的位置, 使用该功能时, 必须开启 `incremental` 选项
- `importHelpers`: 是否将辅助函数从 `tslib` 模块导入, 默认: `false`
- `downlevelIteration`: 是否用于转换为旧版本的 JS 提供可迭代对象的全面支持, 默认: `false`
- `isolatedModules`: 是否将每个文件转换为单独的模块, 默认: `false`

### 编译检查选项

- `strict`: 是否启动所有严格检查的总开关, 默认: `false`, 启动后将开启所有的严格检查选项
- `alwaysStrict`: 是否以严格模式解析, 并为每个源文件发出 `"use strict"`, 默认: `false`
- `noImplicitAny`: 是否禁止隐式的 `any` 类型, 默认: `false`
- `noImplicitThis`: 是否禁止不明确类型的 `this`, 默认: `false`
- `strictNullChecks`: 是否启用严格的空检查, 默认: `false`
- `strictBindCallApply`: 是否在函数上启用严格的 `bind`, `call` 和 `apply` 方法, 默认: `false`
- `strictFunctionTypes`: 是否启用对函数类型的严格检查, 默认: `false`
- `strictPropertyInitialization`: 是否启用严格检查类的属性初始化, 默认: `false`

### 模块解析选项

- `moduleResolution`: 指定模块解析策略, `node` 或 `classic`
- `baseUrl`: 用于解析非绝对模块名的基本目录, 相对模块不受影响
- `paths`: 用于设置模块名称基于 `baseUrl` 的路径映射关系, 可以简化模块导入的路径长度, 例如:

  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": [
          "./src/*"
        ]
      },
      ...
    }
  }
  ```

  表示可以通过 `import ... from '@/foo/bar'` 表示导入 `./src/foo/bar.ts` 文件

- `rootDirs`: 将多个目录放在一个虚拟目录下, 运行编译后文件引入的位置发生改变, 也不会报错
- `typeRoots`: 指定声明文件或文件夹的路径列表
- `types`: 用来指定需要包含的模块, 并将其包含在全局范围内
- `allowSyntheticDefaultImports`: 是否允许从没有默认导出的模块中默认导入, 默认: `false`
- `esModuleInterop`: 是否通过为所有导入模块创建命名空间对象, 允许 CommonJS 和 ESM 模块之间的互操作性, 开启改选项时, 也自动开启`allowSyntheticDefaultImports` 选项, 默认: `false`
- `preserveSymlinks`: 是否不解析符号链接的真实路径, 这是为了在 Node.js 中反映相同的标志, 默认: `false`
- `allowUmdGlobalAccess`: 允许您从模块文件内部访问作为全局变量的 UMD 导出, 如果不使用该选项, 从 UMD 模块导出需要一个导入声明, 默认: `false`

### 源码映射配置

- `sourceRoot`: 指定调试器应定位 TypeScript 文件而不是相对源位置的位置
- `mapRoot`: 指定调试器定位映射文件的位置, 而不是生成的位置
- `inlineSourceMap`: 是否将映射文件内容嵌套到 `.js` 文件中, 这会导致文件变大, 但在某些情况下会很方便, 默认: `false`
- `inlineSources`: 是否将 `.ts` 文件的原始内容作为嵌入字符串包含在 `.map` 文件中, 默认: `false`

### 附加检查

- `noUnusedLocals`: 是否检查未使用的局部变量, 默认: `false`
- `noUnusedParameters`: 是否检查未使用的参数, 默认: `false`
- `noImplicitReturns`: 检查函数是否不含有隐式返回值, 默认: `false`
- `noImplicitOverride`: 是否检查子类继承自基类时, 其重载的函数命名与基类的函数不同步问题, 默认: `false`
- `noFallthroughCasesInSwitch`: 检查 `switch` 中是否含有 `case` 没有使用 `break` 跳出, 默认: `false`
- `noUncheckedIndexedAccess`: 是否通过索引签名来描述对象上有未知键但已知值的对象, 默认: `false`
- `noPropertyAccessFromIndexSignature`: 是否通过 `.` 语法访问字段和索引, 以及在类型中声明属性的方式之间的一致性, 默认: `false`

### 实验选项

- `experimentalDecorators`: 是否启用对装饰器的实验性支持, 装饰器是一种语言特性, 还没有完全被 JavaScript 规范批准, 默认: `false`
- `emitDecoratorMetadata`: 为装饰器启用对发出类型元数据的实验性支持, 默认: `false`

### 高级选项

- `allowUnreachableCode`: 是否允许无法访问的代码 (可选值为 `undefined`, `true`, `false`), 默认: `undefined`
  - `undefined`: 向编辑提供建议作为警告
  - `true`: 未使用的标签被忽略
  - `false`: 引发有关未使用标签的编译器错误
- `allowUnusedLabels`: 是否允许未使用的标签 (可选值为 `undefined`, `true`, `false`), 默认: `undefined`
  - `undefined`: 向编辑提供建议作为警告
  - `true`: 未使用的标签被忽略
  - `false`: 引发有关未使用标签的编译器错误
- `assumeChangesOnlyAffectDirectDependencies`: 是否避免重新检查/重建所有真正可能受影响的文件, 而只会重新检查/重建已更改的文件以及直接导入它们的文件, 默认: `false`
- `charset`: 字符集 (已弃用) , 默认: `utf8`
- `declarationDir`: 提供一种方法来配置发出声明文件的根目录
- `diagnostics`: 用于输出用于调试的诊断信息
- `disableReferencedProjectLoad`: 是否禁用所有可用项目加载到内存中, 默认: `false`
- `disableSizeLimit`: 为了避免在处理非常大的项目时可能出现的内存膨胀问题, 将分配的内存量有一个上限, 默认: `false`
- `disableSolutionSearching`: 在编辑器中搜索查找所有引用或跳转到定义等功能时, 禁止包含复合项目, 默认: `false`
- `disableSourceOfProjectReferenceRedirect`: 是否禁用项目引用源重定向, 默认: `false`
- `emitBOM`: 控制 TypeScript 在写输出文件时是否发出字节顺序标记 (`BOM`), 默认: `false`
- `emitDeclarationOnly`: 是否只发出 `.d.ts` 文件, 不发出 `.js` 文件, 使用该选项时, 需要配合 `declaration` 或 `composite` 一起使用, 默认: `false`
- `explainFiles`: 解释文件, 此选项用于调试文件如何成为编译的一部分, 默认: `false`
- `extendedDiagnostics`: 是否查看编译时花费的时间, 默认: `false`
- `forceConsistentCasingInFileNames`: 是否区分文件系统大小写规则, 默认: `false`
- `generateCpuProfile`: 在编译阶段发出 CPU 配置文件, 只能通过终端或 CLI 调用 `--generateCpuProfile tsc-output.cpuprofile`
- `importsNotUsedAsValues`: 此标志控制如何 `import` 工作方式, 有 3 个不同的选项: `remove`, `preserve` 和 `error`
- `jsxFactory`: 当使用经典的JSX运行时编译 JSX 元素时, 更改 `.js` 文件中调用的函数, 默认: `React.createElement`
- `jsxFragmentFactory`: 指定 JSX 片段工厂函数在指定了 `jsxFactory` 编译器选项的情况下针对 React JSX 发出时使用
- `jsxImportSource`: 当在 Typescript 4.1 中使用 `jsx` 作为 `react-jsx` 或 `react-jsxdev` 时, 声明用于导入 `jsx` 和 `jsxs` 工厂函数的模块说明符
- `keyofStringsOnly`: 当应用具有字符串索引签名的类型时, 此标志将类型操作符的键值更改为返回 `string` 而不是 `string | number`, 已弃用, 默认: `false`
- `listEmittedFiles`: 是否将编译部分生成的文件的名称打印到终端, 默认: `false`
- `listFiles`: 是否打印编译文件部分的名称, 默认: `false`
- `maxNodeModuleJsDepth`: 在 `node_modules` 下搜索并加载 JavaScript 文件的最大依赖深度, 默认: `0`
- `newLine`: 指定发出文件时要使用的换行规则, `CRLF` (Windows) 或 `LF` (Unix/Linux)
- `noEmitHelpers`: 是否使用全局作用域助手函数提供实现, 并完全关闭助手函数的发出, 而不是使用 `importhelper` 来导入助手函数, 默认: `false`
- `noEmitOnError`: 有错误时不进行编译, 默认: `false`
- `noErrorTruncation`: 是否禁止截断错误消息, 已弃用, 默认: `false`
- `noImplicitUseStrict`: 是否禁止无隐式严格模式, 默认: `false`
- `noLib`: 是否禁止自动包含任何库文件, 默认: `false`
- `noResolve`: 是否禁用析后的文件添加到程序中；默认情况下, TypeScript 会检查 `import` 和 `reference` 指令的初始文件集, 并将这些解析后的文件添加到你的程序中, 默认: `false`
- `noStrictGenericChecks`: 是否禁用严格的泛型检查, 默认: `false`
- `out`: 该选项以不可预测或一致的方式计算最终文件位置, 已弃用
- `preserveConstEnums`: 是否禁止删除枚举常量生成代码中的声明, 默认: `false`
- `reactNamespace`: React 命名空间, 使用 `jsxFactory` 来代替
- `resolveJsonModule`: 是否解析 JSON 模块, 默认: `false`
- `skipDefaultLibCheck`: 是否跳过默认库声明文件的类型检查, 默认: `false`
- `skipLibCheck`: 是否跳过声明文件的类型检查, 这可以在编译期间以牺牲类型系统准确性为代价来节省时间, 默认: `false`
- `stripInternal`: 是否禁止 JSDoc 注释中带有 `@internal` 注释的代码发出声明, 默认: `false`
- `suppressExcessPropertyErrors`: 是否禁用报告过多的属性错误, 默认: `false`
- `suppressImplicitAnyIndexErrors`: 是否抑制隐式 `any` 索引的错误, 默认: `false`
- `traceResolution`: 当尝试调试未包含模块的原因时启用该选项让 TypeScript 打印有关每个处理文件的解析过程的信息, 默认: `false`
- `useDefineForClassFields`: 此标志用作迁移到即将推出的类字段标准版本的一部分, 默认: `false`

### 命令行选项

`preserveWatchOutput`: 是否在监视模式下保留过时的控制台输出, 而不是每次发生更改时都清除屏幕, 默认: `false`
`pretty`: 是否使用颜色对上下文错误和消息进行样式化, 默认: `true`

### 监视选项

用于配置 `tsc` 命令的 `--watch` 参数工作方式

- `watchFile`: 监视单个文件的策略, 默认: `useFsEvents`
- `fixedPollingInterval`: 以固定时间间隔每秒多次检查每个文件的更改
- `priorityPollingInterval`: 每秒多次检查每个文件的更改, 但使用启发式方法检查某些类型的文件的频率低于其他文件
- `dynamicPriorityPolling`: 使用动态队列, 其中不经常修改的文件将不那么频繁地检查
- `useFsEvents`: 尝试使用操作系统/文件系统的本机事件进行文件更改
- `useFsEventsOnParentDirectory`: 尝试使用操作系统/文件系统的本机事件来监听文件父目录的变化
- `watchDirectory`: 在缺乏递归文件监视功能的系统下如何监视整个目录树的策略, 默认: `useFsEvents`
- `fixedPollingInterval`: 以固定时间间隔每秒多次检查每个目录的变化
- `dynamicPriorityPolling`: 使用动态队列, 其中不经常修改的目录将不那么频繁地检查
- `useFsEvents`: 尝试使用操作系统/文件系统的本机事件进行目录更改
- `fallbackPolling`: 使用文件系统事件时, 此选项指定当系统用完本机文件观察器和/或不支持本机文件观察器时使用的轮询策略, 默认: `dynamicPriorityPolling`
- `fixedPollingInterval`: 以固定时间间隔每秒多次检查每个文件的更改
- `priorityPollingInterval`: 每秒多次检查每个文件的更改, 但使用启发式方法检查某些类型的文件的频率低于其他文件
- `dynamicPriorityPolling`: 使用动态队列, 其中不经常修改的文件将不那么频繁地检查
- `synchronousWatchDirectory`: 禁用对目录的延迟监视
- `synchronousWatchDirectory`: 在本机不支持递归观看的平台上同步调用回调, 并更新目录观察者的状态, 默认: `false`
- `excludeDirectories`: 使用排除目录来大幅减少 `--watch` 期间被监视的文件数量.
- `excludeFiles`: 使用 `excludeFiles` 从被监视的文件中删除一组特定的文件

### 自动类型获取选项

- `typeAcquisition`: 用于控制 TypeScript 的自动类型获取 (ATA), 该配置为一个对象, 可包括如下属性:
  - `enable`: 提供在项目中禁用类型获取的配置, 默认: `false`
  - `include`: 使用 `include` 来指定应从绝对类型中使用哪些类型
  - `exclude`: 提供用于禁用项目中某个模块的类型获取的配置
  - `disableFilenameBasedTypeAcquisition`: 是否禁用基于文件名的类型获取, TypeScript 的类型获取可以根据项目中的文件名推断应该添加哪些类型, 默认: `false`
