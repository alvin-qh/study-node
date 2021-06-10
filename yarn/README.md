# Use YARN

## 1. Install Yarn

### 1.1. Debian / Ubuntu

1. Install deb package repository
    
    ```bash
    $ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    $ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    ```

2. Install package

    ```bash
    $ sudo apt update && sudo apt install yarn
    ```

    The isntall command should install `nodejs` and `nodejs-doc` packages, if do not want install them, use the following command

    ```bash
    $ sudo apt update && sudo apt install --no-install-recommends yarn
    ```

### 1.2. CentOS / Fedora / RHEL

1. Install RPM package repository
    
    ```bash
    $ curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repoyarn.list
    ```

    If do not already have Node.js installed, the NodeSource repository need be set like:

    ```bash
    $ curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
    ```

2. Install package

    ```bash
    $ sudo yum install yarn
    # or 
    $ sudo dnf install yarn
    ```

### 1.3. macOS

```bash
$ brew install yarn
```

## 2. Use yarn

See [Document](https://yarn.bootcss.com/docs/)

### 2.1. Create yarn project

- Create Node.js project

    ```bash
    $ yarn init
    ```

### 2.2. Dependencies management

- Add dependency package

    With differnent versions

    ```bash
    $ yarn add <package name>
    $ yarn add <pacakge name>@<version>
    $ yarn add <pacakge name>@<tag>
    ```

    With difference scope as `devDependencies`, `peerDependencies` and `optionalDependencies`

    ```bash
    $ yarn add <package name> --dev
    $ yarn add <package name> --peer
    $ yarn add <package name> --optional
    ```

- Update dependeny packages

    ```bash
    $ yarn update <package name>
    $ yarn update <package name>@<version>
    $ yarn update <package name>@<tag>
    ```

- Remove dependency packages

    ```bash
    $ yarn remove <pcakge name>
    ```
    