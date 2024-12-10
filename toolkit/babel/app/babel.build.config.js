module.exports = {
  ...require('./babel.config.js'),
  plugins: [
    ['babel-plugin-add-import-extension', {
      extension: 'js',
      replace: true,
      observedScriptExtensions: ['js', 'mjs', 'cjs']
    }],
  ],
  ignore: [
    '**/*.spec.js',
  ],
};
