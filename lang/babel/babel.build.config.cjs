const defaultConfig = require('./babel.config.cjs');

module.exports = {
  ...defaultConfig,
  ignore: [
    '**/*.spec.js',
  ],
};
