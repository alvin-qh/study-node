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
  sourceMap: true,
  sourceRoot: './src',
};
