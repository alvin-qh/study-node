# Node 包管理器

目前流行的包管理器包括

- `npm`
- `yarm`
- `pnpm`
- `bun`

其中, `bun` 已经不依赖于 `node` 实行, 相当于是程序解释器 + 包管理器

## 1. 安装

所有的包管理器都可以通过两种方式来安装: NPM 安装以及全局安装

NPM 安装即通过 `npm install -g <package-name>` 命令安装即可, 优点时操作简单, 全平台可用, 缺点是通过 `nvm` 切换 node 版本后, 需要重新安装

全局安装包括:

1. `yarm`

    脚本安装

    ```bash
    curl -o- -L https://yarnpkg.com/install.sh | bash
    ```

    CentOS / Fedora / RHEL:

    ```bash
    curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
    sudo yum install yarn
    ```

    Windows

    下载安装包 <https://classic.yarnpkg.com/latest.msi> 安装, 或者通过脚本安装

    ```powershell
    scoop install yarn
    ```

    Debian / Ubuntu

    ```bash
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt update && sudo apt install yarn
    ```

    macOS:

    ```bash
    brew install yarn
    ```

2. `pnpm`

    Linux

    ```bash
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    ```

    Windows

    ```powershell
    iwr https://get.pnpm.io/install.ps1 -useb | iex
    # or
    scoop install nodejs-lts pnpm
    # or
    winget install pnpm
    ```

    macOS

    ```bash
    brew install pnpm
    ```

3. `bun`

    Linux

    ``` bash
    curl -fsSL https://bun.sh/install | bash
    ```

    ```bash
    brew tap oven-sh/bun
    brew install bun
    ```

## 2. 设置软件包镜像网站

1. `npm`

    获取配置

    ```bash
    npm config get registry
    ```

    修改配置

    ```bash
    npm config set registry https://registry.npm.taobao.org
    ```

    恢复默认配置

    ```bash
    cat ~/.npmrc
    ```

2. `yarn`

    获取配置

    ```bash
    yarn config get registry
    ```

    修改配置

    ```bash
    yarn config set registry https://registry.npm.taobao.org
    ```

    恢复默认配置

    ```bash
    yarn config set registry
    ```

    查看配置文件

    ```bash
    cat ~/.yarnrc
    ```

3. `pnpm`

    获取配置

    ```bash
    pnpm config get registry
    ```

    修改配置

    ```bash
    pnpm config set registry https://registry.npm.taobao.org
    ```

    恢复默认配置

    ```bash
    pnpm config set registry
    ```

    PNPM 使用和 NPM 相同的配置文件, 即 `cat ~/.npmrc`

4. `bun`

    Bun 暂时尚未提供命令行方式修改, 需要修改 `~/.bunfig.toml` 文件, 并在其中添加如下内容:

    ```ini
    [install]
    registry="https://registry.npm.taobao.org/"
    ```
