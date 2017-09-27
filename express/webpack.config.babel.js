import webpack from "webpack";

import glob from "glob";
import path from "path";

import ExtractTextPlugin from "extract-text-webpack-plugin";
import AccessPlugin from "assets-webpack-plugin";
import CleanupPlugin from "webpack-cleanup-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const webConfig = {
    isProd: process.env.NODE_ENV === 'production',
    paths: {
        source: file => path.join('asset', file || ''),
        dest: file => path.join('src/public', file || '')
    }
};

function makeEntries() {
    const src = `./${webConfig.paths.source('js')}/`;
    const entries = {};

    glob.sync(path.join(src, '/**/main.js')).map(file => `./${file}`)
        .forEach(file => {
            let name = path.dirname(file);
            name = name.substr(name.lastIndexOf('/') + 1);
            entries[name] = file;
        });
    return entries;
}

const plugins = (() => {
    const ProvidePlugin = webpack.ProvidePlugin;
    const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
    const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

    let plugins = [
        new ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            moment: 'moment',
            _: 'lodash'

        }),
        new CommonsChunkPlugin({
            name: ['vendor', 'manifest']
        }),
        new ExtractTextPlugin({
            filename: webConfig.isProd ? 'css/[name]-[chunkhash:8].css' : 'css/[name].css',
            disable: false,
            allChunks: true,
        }),
        new CleanupPlugin(),
        new CopyWebpackPlugin([{
            from: webConfig.paths.source('favicon.ico'),
            to: ''
        }], {
            ignore: [],
            copyUnmodified: true,
            debug: "debug"
        })
    ];

    if (webConfig.isProd) {
        plugins = plugins.concat([
            new UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false,
                }
            }),
            new AccessPlugin({
                filename: 'src/conf/manifest.json',
                prettyPrint: true,
                fullPath: false
            })
        ]);
    }

    return plugins;
})();

module.exports = {
    entry: Object.assign({
        vendor: ['jquery', 'bootstrap', 'formvalidation', 'moment', 'lodash']
    }, makeEntries()),
    output: {
        path: path.resolve(webConfig.paths.dest()),
        filename: webConfig.isProd ? 'js/[name]-[chunkhash:8].js' : 'js/[name].js',
        publicPath: '/',
        chunkFilename: webConfig.isProd ? 'js/[name]-[chunkhash:8].js' : 'js/[name].js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.coffee']
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'stage-3']
                }
            }]
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: webConfig.isProd
                    }
                }, {
                    loader: 'less-loader',
                    options: {importLoaders: 1}
                }],
                fallback: 'style-loader'
            })
        }, {
            test: /\.(eot|woff|woff2|ttf)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: webConfig.isProd ? 'css/fonts/[name]-[hash:8].[ext]' : 'css/fonts/[name].[ext]'
                }
            }]
        }, {
            test: /\.(svg|png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: webConfig.isProd ? 'css/images/[name]-[hash:8].[ext]' : 'css/images/[name].[ext]'
                }
            }]
        }, {
            test: /\.vue$/,
            exclude: [/node_modules/],
            loader: 'vue-loader'
        }]
    },
    plugins: plugins,
    devServer: {
        contentBase: path.resolve('out/'),
        inline: true,
        hot: true
    },
    devtool: 'cheap-source-map',
};
