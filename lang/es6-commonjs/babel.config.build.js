const defaultConfig = require('./babel.config');

module.exports = {
  ...defaultConfig,
  ignore: [
    '**/*.spec.js',
  ],
};
