gulp
===

## 安装

### 安装 gulp-cli (命令行工具)

```bash
$ npm install --g gulp-cli
```

### 安装 gulp 开发组件

```bash
$ npm install --save-dev gulp
```
## gulp 任务

### 入口文件 

gulp 的入口文件为`gulpfile.js`，如下：

```javascript
'use strict';

let gulp = require('gulp'),
    sequence = require('run-sequence');

['clean', 'js_bundle', 'css_bundle', 'static', 'deploy', 'watch']
    .map(function (task) {
        gulp.task(task, require('./gulp_tasks/' + task));
    });

gulp.task('default', () => sequence('assets', 'watch'));
gulp.task('assets', () => sequence('clean', 'js_bundle', 'css_bundle', 'static', 'deploy'));
```

默认的 gulp 任务名称为`default`，其它 gulp 任务都必须由 default 任务来启动。

上述代码中，`default`任务启动了`assets`和`watch`任务，`assets`任务又启动了一系列任务。

每个任务均由一个 node 模块表示，这些模块均位于`gulp_tasks`路径下。

### 启动任务

一旦存在`gulpfile.js`，则可以在当前路径下通过`gulp`命令来启动 gulp 任务链。

```sh
$ gulp
```

## gulp API

```javascript
let gulp = require('gulp');

gulp.task('task name', () => {
  	return gulp.src(...)
               .pipe(plugin1)
    		   .pipe(plugin2)
    		   .pipe(gulp.dest('dest dir'))
});
```

一般情况下，只需要使用 4 个 API 即可：

### gulp.src 

指定要处理的文件，支持通配符，例如：

```javascript
gulp.src('asset/css/**/*.css')
```

表示 asset/css 路径下所有子路径中的 *.css 文件。

```javascript
gulp.src([
    '!asset/js/common/**',
    'asset/js/**/*.js'
])
```

取数组中所有表示文件的集合。`!`开头的表示“排除”。

### gulp.pipe

类似一条管道，表示将 gulp.src 中包含的某一个文件内容，传输给某一个处理器。例如：

```javascript
gulp.src(...)
    .pipe(cleanCss())
```

表示将指定文件内容送入 cleanCss 处理器中进行处理。

### gulp.dest

表示将 gulp.pipe 处理的文件写入目标路径，例如：

```javascript
gulp.src(...)
    .pipe(plugin)
    .pipe(gulp.dest('asset_build/css/common'));
```

表示将处理的文件写入`asset_build/css/common/`目录下。

## gulp 插件

gulp 的绝大部分功能都需要通过插件来体现：

### clean 插件

用于删除目标路径或文件

#### 安装

```sh
$ npm install --save-dev gulp-clean
```

#### 使用 (gulp_tasks/clean.js)

```javascript
'use strict';

let gulp = require('gulp'),
    clean = require('gulp-clean');

module.exports = () => {
    return gulp.src(['asset_build', 'www/asset'], {read: false})
        .pipe(clean({force: true}))
};
```



