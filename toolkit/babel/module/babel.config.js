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
    [
      'babel-plugin-add-import-extension', {
        extension: 'js',
        replace: true,
        observedScriptExtensions: ['js', 'mjs', 'cjs'],
      },
    ],
  ],
  sourceMap: true,
  sourceRoot: './src',
};
