const webpack = require("webpack");
const glob = require("glob");
const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackAssetsPlugin = require("webpack-assets-manifest");

const ProvidePlugin = webpack.ProvidePlugin;
const ProgressPlugin = webpack.ProgressPlugin;

const isProd = process.env.NODE_ENV === "production";
const src = file => path.join("asset", file || "");
const dist = file => path.join("src/public", file || "");

function makeEntries() {
  const entries = {};

  glob.sync(path.join(src("js"), "/**/main.js")).map(file => `./${file}`)
    .forEach(file => {
      let name = path.dirname(file);
      name = name.substring(name.lastIndexOf("/") + 1);
      entries[name] = file;
    });
  return entries;
}

const prodPlugins = isProd ? [
  new WebpackAssetsPlugin({
    output: "manifest.json",
    merge: false,
    customize(entry) {
      switch (path.extname(entry.key).toLowerCase()) {
        case ".map":
        case ".txt":
          return false;
        default:
          const prefix = path.dirname(entry.value);
          return {
            key: `${prefix}/${entry.key}`,
            value: entry.value
          };
      }
    }
  })
] : [];

module.exports = {
  mode: isProd ? "production" : "development",
  entry: Object.assign(
    {
      vendor: ["jquery", "bootstrap", "moment", "lodash", "common"]
    },
    makeEntries()
  ),
  output: {
    path: path.resolve(dist()),
    filename: isProd ? "js/[name]-[chunkhash:8].js" : "js/[name].js",
    publicPath: "/",
    chunkFilename: isProd ? "js/[name]-[chunkhash:8].js" : "js/[name].js",
  },
  resolve: {
    alias: {
      common: path.resolve(src("js/common/common.js"))
    },
    extensions: [".js", ".vue", ".json"]
  },
  optimization: {
    minimize: isProd,
    removeEmptyChunks: true,
    runtimeChunk: {
      name: "manifest",
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/env"]
          }
        }
      ]
    },
    {
      test: /\.(less|css)$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        "less-loader"
      ]
    }, {
      test: /\.(eot|woff|woff2|ttf)$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 1024,
            fallback: "file-loader",
            name: isProd ? "fonts/[name]-[hash:8].[ext]" : "fonts/[name].[ext]"
          }
        }
      ]
    }, {
      test: /\.(svg|png|jpg|gif)$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 1024,
            fallback: "file-loader",
            name: isProd ? "images/[name]-[hash:8].[ext]" : "images/[name].[ext]"
          }
        }
      ]
    }]
  },
  plugins: [
    new ProgressPlugin(),
    new CleanWebpackPlugin(),
    new ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: src("images/*"),
          to: "images/[name][ext]"
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? "css/[name]-[chunkhash:8].css" : "css/[name].css"
    }),
    ...prodPlugins
  ],
  devtool: "cheap-source-map",
};
