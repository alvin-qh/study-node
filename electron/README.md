# Electron

## 1. 初始化

### 1.1. 安装框架

参考: <https://www.electronjs.org/zh/blog/forge-v6-release>

安装 Electron 推荐使用官方提供的 Electron Forg 工具, 该工具可以通过项目模板, 一次性配置好 Electron 所需的依赖以及相关打包工具的配置 (Webpack 或 Vite), 执行以下命令即可:

```bash
yarn create electron-app <app-name> --template=vite-typescript
```

该命令执行如下操作:

1. 在当前路径下创建 `<app-name>` 文件夹 (`<app-name>` 应为实际应用名称);
2. 通过 `vite-typescript` 模板创建 `vite` 打包环境, 并支持 `typescript`;
3. 添加所需的依赖, 具体详见 [package.json](./package.json) 文件;

### 1.2. 在安装过程中使用镜像

参考: <https://www.electronjs.org/zh/docs/latest/tutorial/installation>

`yarn` 命令在下载 `electron` 安装包时会通过 `registry` 配置项下载 node 包代理, 但 `electron` 在编译打包过程中还会下载所需的二进制包, 而这些包的下载不通过 `registry` 配置项定义的镜像网站, 此时需定义**环境变量**如下:

```bash
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
```

> 其中, npmmirror.com 为 npm 包管理器在国内的镜像网站

### 1.2. 启动应用

通过 `yarn start` 命令即可启动应用 (调试环境), 有一些需要注意的点:

#### 1.2.1. Linux 平台注意事项

1. 如果启动时发生 `error while loading shared libraries: xxx: cannot open shared object file: No such file or directory` 错误, 则意味着缺少必要的依赖库, 需要安装:

   ```bash
   sudo apt install \
      libgconf-2-4 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libgdk-pixbuf2.0-0 \
      libgtk-3-0 \
      libgbm-dev \
      libnss3-dev \
      libxss-dev \
      libdrm2 \
      libgl1
   ```

2. 如果启动时提示 `failed to connect to the bus: failed to connect to socket /run/dbus/system_bus_socket: no such file or directory` 则表示无法连接系统总线, 该总线用于应用调试, 执行如下命令:

   ```bash
   sudo service dbus start
   ```

   或者

   ```bash
   systemctl start dbus
   ```

3. 如果启动后未显示窗口, 主进程自动停止, 则有以下可能

   - 未启动 X11 服务

     如果是在 WSL 系统上, 则选装 X11 服务

     ```bash
     sudo apt install x11-apps
     ```

4. 启动时提示 `ANGLE Display::initialize error 12289: Could not create a backing OpenGL context.` 警告, 提示 OpenGL 无法初始化

   增加如下环境变量:

   ```bash
   export LIBGL_ALWAYS_INDIRECT=0
   export DISPLAY=:0
   ```
