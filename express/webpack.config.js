const webpack = require('webpack');
const glob = require('glob');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanupPlugin = require('webpack-cleanup-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackAssetsPlugin = require('webpack-assets-manifest');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


function normalizePath(p) {
    return p.replace(/\\/g, '/');
}

const CONFIG = {
    isProd: process.env.NODE_ENV === 'production',
    paths: {
        src: file => normalizePath(path.join('asset', file || '')),
        dest: file => normalizePath(path.join('src/public', file || ''))
    }
};

function makeEntries() {
    const src = `./${CONFIG.paths.src('js')}/`;
    const entries = {};

    glob.sync(path.join(src, '/**/main.js')).map(file => `./${file}`)
        .forEach(file => {
            let name = normalizePath(path.dirname(file));
            name = name.substr(name.lastIndexOf('/') + 1);
            entries[name] = file;
        });
    return entries;
}

const extractCss = new ExtractTextPlugin({
    filename: CONFIG.isProd ? 'css/[name]-[chunkhash:8].css' : 'css/[name].css',
    disable: false,
    allChunks: true,
});

const plugins = (() => {
    const ProvidePlugin = webpack.ProvidePlugin;

    let plugins = [
        new CleanupPlugin({
            quiet: !CONFIG.isProd,
            exclude: CONFIG.isProd ? [] : ['fonts/**/*', 'images/**/*']
        }),
        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        extractCss,
        new CopyWebpackPlugin([{
            from: CONFIG.paths.src('images/*'),
            to: 'images/[name].[ext]'
        }], {
            ignore: [],
            copyUnmodified: true,
            debug: "debug"
        }),
    ];

    if (CONFIG.isProd) {
        plugins = plugins.concat([
            new WebpackAssetsPlugin({
                output: 'manifest.json',
                merge: false,
                customize(key, value, originalValue, manifest) {
                    switch (manifest.getExtension(value).substr(1).toLowerCase()) {
                        case 'js.map':
                        case 'css.map':
                            return false;
                        case 'js':
                            key = `js/${key}`;
                            break;
                        case 'css':
                            key = `css/${key}`;
                            break;
                    }
                    return {
                        key: key,
                        value: value
                    }
                }
            }),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {discardComments: {removeAll: true}},
                canPrint: true
            })
        ]);
    }
    return plugins;
})();

module.exports = {
    mode: CONFIG.isProd ? 'production' : 'development',
    entry: Object.assign({vendor: ['jquery', 'bootstrap', 'moment', 'lodash', 'common']}, makeEntries()),
    output: {
        path: path.resolve(CONFIG.paths.dest()),
        filename: CONFIG.isProd ? 'js/[name]-[chunkhash:8].js' : 'js/[name].js',
        publicPath: '/',
        chunkFilename: CONFIG.isProd ? 'js/[name]-[chunkhash:8].js' : 'js/[name].js',
    },
    resolve: {
        alias: {
            common: `./${CONFIG.paths.src('js')}/common/common.js`,
        },
        extensions: ['.js', '.vue', '.json']
    },
    optimization: {
        minimize: CONFIG.isProd,
        removeEmptyChunks: true,
        splitChunks: {
            chunks: 'all',
            name: 'vendor'
        },
        runtimeChunk: {
            name: 'manifest',
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env']
                }
            }]
        }, {
            test: /\.css/,
            use: extractCss.extract({
                use: [{
                    loader: 'css-loader'
                }],
                fallback: 'style-loader'
            })
        }, {
            test: /\.less$/,
            use: extractCss.extract({
                use: [{
                    loader: 'css-loader',
                }, {
                    loader: 'less-loader',
                    options: {importLoaders: 1}
                }],
                fallback: 'style-loader'
            })
        }, {
            test: /\.(eot|woff|woff2|ttf)$/,
            use: [{
                loader: 'file-loader',
                query: {
                    limit: 10240,
                    name: CONFIG.isProd ? 'fonts/[name]-[hash:8].[ext]' : 'fonts/[name].[ext]'
                }
            }, {
                loader: 'url-loader',
                query: {
                    limit: 10240,
                    fallback: 'file-loader',
                    name: CONFIG.isProd ? 'fonts/[name]-[hash:8].[ext]' : 'fonts/[name].[ext]'
                }
            }]
        }, {
            test: /\.(svg|png|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                query: {
                    limit: 10240,
                    name: CONFIG.isProd ? 'images/[name]-[hash:8].[ext]' : 'images/[name].[ext]'
                }
            }, {
                loader: 'url-loader',
                query: {
                    limit: 10240,
                    fallback: 'file-loader',
                    name: CONFIG.isProd ? 'images/[name]-[hash:8].[ext]' : 'images/[name].[ext]'
                }
            }]
        }]
    },
    plugins: plugins,
    devtool: 'cheap-source-map',
};