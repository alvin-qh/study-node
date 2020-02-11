Study node.js
===

## Setup

### Install node.js

```bash
$ brew install node
```

### Using npm China proxy

```bash
$ npm config set registry https://registry.npm.taobao.org
```

## Install nvm

### Download and install

- Use curl

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
```

- Or use wget

```bash
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
```

### Set environment

- Modify `~/.bashrc` (or `~/.zshrc` or `~/.bash_profile`), and add the following content:

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

## Use jupyter lab

### 1. Make python virtualenv

```bash
$ pyenv local 3.7.5         # if use pyenv
$ python -m venv .venv --prompt='study-nodejs'
$ source .venv/bin/activate
```

### 2. Install python package

```bash
$ pip install jupyterlab
$ pip install jupyter_nbextensions_configurator
```

### 3. Install tslab

```bash
$ npm install -g tslab
```