module.exports = {
  presets: [
    [
      '@babel/env',
      {
        // modules: false,
        targets: { node: 'current' },
      },
    ],
  ],
  plugins: [
    ['babel-plugin-add-import-extension', { extension: 'js' }],
  ],
  sourceMap: true,
  sourceRoot: './src',
};
