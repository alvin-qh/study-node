Express
========

## Install dependencies

```bash
# core libs
$ npm install -save express
$ npm install -save express-validator
$ npm install -save body-parser
$ npm install -save cookie-parser
$ npm install -save serve-favicon

# logger libs
$ npm install -save morgan

# template libs
$ npm install -save nunjucks

# debug libs
$ npm install -save debug
```

## Install and create project

### Install express-generator

```bash
$ npm install -g express-generator
```

### Create express project

```bash
$ express ./myapp
```

### Install express packages

```bash
$ cd ./myapp
$ npm install
```

### Start application

```bash
$ npm start
```
    
or 

```bash
$ node bin/www
```

## Install Bootstrap and jQuery

### Install and setting bower

#### Install bower with npm

```bash
$ npm install -g bower
```

#### Config bower download directory

Create **.bowerrc** file, and with flowing content: 

```json
{
    "directory": "public/bower_components"
}
```

#### Setting CSS and JS dependencies

Create **bower.json** file, and with flowing content:

```json
{
    "name": "express-study",
    "version": "0.0.1",
    "dependencies": {
        "bootstrap": "^3.3.6",
        "jquery": "^2.1.4"
    },
    "devDependencies": {
    }
}
```