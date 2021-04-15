# Setup python

## 1. Setup python env

### 1.1. Install pyenv

Use `pyenv` to install and manage python version

- On macOS

  ```bash
  $ brew install pyenv
  $ brew install pyenv-virtualenv
  ```

- On Linux

  ```bash
  $ curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
  ```

  Also can download script from **[https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer](https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer)** then run it by `bash`

### 1.2. Install python

After pyenv was installed, then install python

- Check if python was installed
  
  ```bash
  $ pyenv versions
    system
    3.10.0a5
  * 3.8.5 (set by /home/alvin/.pyenv/version)
  ```

- Install some python version (eg: 3.8.5)

  ```bash
  $ pyenv install 3.8.5
    Downloading Python-3.8.5.tar.xz...
  -> https://www.python.org/ftp/python/3.8.6/Python-3.8.5.tar.xz
  ...
  ```

  > If cannot download python automated, also can download it manually from `https://www.python.org/ftp/python/3.8.6/Python-<version>.tar.xz`, then put the download file into `~/.pyenv/cache` folder, then run install command again

- Set some version of python as the default version
  
  ```bash
  $ pyenv global 3.8.5
  ```

### 1.3. Create virtualenv

In project folder, run python command to create virtualenv

- Set spicial python version

  ```bash
  $ pyenv local 3.8.5
  ```

  Then the python version was specialized in project folder

- Create virtualenv environment

  ```bash
  $ python -m venv .venv --prompt='venv-prompt'
  ```

- Active the virtualenv

  ```bash
  $ source .venv/bin/activate
  ```

- Install the dependency packages

  ```bash
  $ pip install -r base-requirements.txt
  ```

## 2. Use jupyter lab

### 2.1. Install jupyter lab

- Make sure the following package was installed in every virtualenv

  ```plain
  jupyterlab
  jupyterlab_code_formatter
  jupyter_nbextensions_configurator
  lckr-jupyterlab-variableinspector
  jupyterlab-lsp
  python-language-server[all]
  ```

  - `jupyterlab`: The core package of jupyter lab
  - `jupyterlab_code_formatter`: Python code formatter
  - `jupyter_nbextensions_configurator`: The jupyter lab extension plugin managment
  - `autopep8`: The code formatter by `autopep8`
  - `lckr-jupyterlab-variableinspector`: The visualization variables inspector
  - `jupyterlab-lsp`: The Language Server integration
  - `python-language-server[all]`: The Language Server for Python language

- Start jupyter lab (without start web browser automated)

  ```bash
  $ jupyter lab --no-browser
  ...
    To access the server, open this file in a browser:
        file:///home/alvin/.local/share/jupyter/runtime/jpserver-14422-open.html
    Or copy and paste one of these URLs:
        http://localhost:8888/lab?token=9a147f84338d134c8be8f8e2edb54f7c6d7b7bb9666af053
     or http://127.0.0.1:8888/lab?token=9a147f84338d134c8be8f8e2edb54f7c6d7b7bb9666af053
  ```

  Open the URL `http://127.0.0.1:8888/lab?token=9a147f84338d134c8be8f8e2edb54f7c6d7b7bb9666af053` in browser to access the home page of the jupyter lab

### 2.2. Setup jupyter lab

#### 2.2.1. Setup `jupyterlab_code_formatter`

- Install dependency if jupyter lab version less than 3.0

  ```bash
  $ jupyter serverextension enable --py jupyterlab_code_formatter
  $ jupyter labextension install @ryantam626/jupyterlab_code_formatter
  ```

  ⚡If the installation is too slow, setup the mirror site of `yarn` of node.js:

  ```bash
  $ yarn config set registry https://registry.npm.taobao.org --global
  $ yarn config set disturl https://npm.taobao.org/dist --global
  ```
  
  Or use `yrm` on [https://github.com/i5ting/yrm](https://github.com/i5ting/yrm)

- Start jupyter lab and open it in browser

  In menu `Settings > Advanced Settings Editor > Jupyterlab Code Formatter`, setup the code formatter

  ```json
  {
    "autopep8": {
      "max_line_length": 120,
      "ignore": [
        "E226",
        "E302",
        "E41"
      ]
    },
    "preferences": {
      "default_formatter": {
        "python": "autopep8",
        "r": "formatR"
      }
    }
  }
  ```

  In menu `Settings > Advanced Settings Editor > Keyboard Shortcuts`, setup keyboard shortcuts

  ```json
  {
    "shortcuts": [
      {
        "command": "jupyterlab_code_formatter:autopep8",
        "keys": [
          "Ctrl K",
          "Ctrl M"
        ],
        "selector": ".jp-Notebook.jp-mod-editMode"
      }
    ]
  }
  ```

## 2. Demos

1. Python Basic
