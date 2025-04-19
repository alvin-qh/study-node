import * as path from 'node:path';

import * as glob from 'glob';

import webpack from 'webpack';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackAssetsManifest } from 'webpack-assets-manifest';

const ProvidePlugin = webpack.ProvidePlugin;
const ProgressPlugin = webpack.ProgressPlugin;

const isProd = process.env.NODE_ENV === 'production';

const src = file => path.join('src', file || '');
const dist = file => path.join('../assets', file || '');

function makeEntries() {
  const entries = {};

  glob.sync(src('/**/index.ts')).map(file => `./${file}`)
    .forEach(file => {
      let name = path.dirname(file);
      name = name.substring(name.lastIndexOf('/') + 1);
      entries[name] = file;
    });
  return entries;
}

export default {
  mode: isProd ? 'production' : 'development',
  entry: {
    vendor: ['jquery', 'bootstrap', 'common'],
    ...makeEntries(),
  },
  output: {
    path: path.resolve(dist()),
    filename: isProd ? 'js/[name]-[chunkhash:8].js' : 'js/[name].js',
    publicPath: '/',
    chunkFilename: isProd ? 'js/[name]-[chunkhash:8].js' : 'js/[name].js',
  },
  resolve: {
    alias: { common: path.resolve(src('common/common.ts')) },
    extensions: ['.ts', '.vue', '.json'],
  },
  optimization: {
    minimize: isProd,
    removeEmptyChunks: true,
    runtimeChunk: { name: 'manifest' },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(less|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              fallback: 'file-loader',
              name: isProd ? 'fonts/[name]-[hash:8].[ext]' : 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              fallback: 'file-loader',
              name: isProd ? 'images/[name]-[hash:8].[ext]' : 'images/[name].[ext]',
            },
          },
        ],
      }],
  },
  plugins: [
    new ProgressPlugin(),
    new CleanWebpackPlugin(),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: src('images/*'),
          to: 'images/[name][ext]',
        },
      ],
    }),
    new MiniCssExtractPlugin({ filename: isProd ? 'css/[name]-[chunkhash:8].css' : 'css/[name].css' }),
    new WebpackAssetsManifest({
      output: 'manifest.json',
      merge: false,
      customize(entry) {
        switch (path.extname(entry.key).toLowerCase()) {
          case '.map':
          case '.txt':
            return false;
          default:
            return {
              key: `${path.dirname(entry ? entry.value : '')}/${entry.key}`,
              value: entry ? entry.value : '',
            };
        }
      },
    }),
  ],
  devtool: 'cheap-source-map',
};
