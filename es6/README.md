# Babel with ES6

## Babel node dependencies

```json
 "dependencies": {
    "@babel/cli": "^7.11.6",
    "@babel/core": "^7.11.6",
    "@babel/node": "^7.10.5",
    "@babel/plugin-transform-runtime": "^7.11.5",
    "@babel/preset-env": "^7.11.5",
    "@babel/register": "^7.11.5",
    "@babel/runtime": "^7.11.2"
  },
  "babel": {
    "presets": [
      "@babel/env"
    ],
    "plugins": [
      "@babel/transform-runtime"
    ]
  }
```

## Run code with babel node

```bash
$ ./node_modules/.bin/babel-node index.js
```

## Run test with mocha and babel register

```bash
$ ./node_modules/.bin/mocha --require @babel/register ./test/**/*.js
```

