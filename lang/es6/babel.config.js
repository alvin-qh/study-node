module.exports = {
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    [
      "babel-plugin-module-resolver",
      {
        "alias": {
          "@root": "./src"
        }
      }
    ]
  ],
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ],
  "sourceRoot": "./src",
  "sourceMap": true
};
