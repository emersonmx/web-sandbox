// COMMON
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
    entry: {
        main: path.join(__dirname, 'src', 'main.js'),
    },

    output: {
        path: path.join(__dirname, 'dist'),
    },

    module: {
        rules: [
            {
                test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader?name=/[hash].[ext]',
            },

            { test: /\.json$/, loader: 'json-loader' },

            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
        ],
    },

    plugins: [
        new webpack.ProvidePlugin({
            fetch:
                'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
        }),

        new AssetsPlugin({
            filename: 'webpack.json',
            path: path.join(process.cwd(), 'site/data'),
            prettyPrint: true,
        }),

        new CopyWebpackPlugin([
            {
                from: './src/fonts/',
                to: 'fonts/',
                flatten: true,
            },
        ]),
    ],
};

// DEV
const merge = require('webpack-merge');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',

    output: {
        filename: '[name].js',
        chunkFilename: '[id].css',
    },

    devServer: {
        port: process.env.PORT || 3000,
        contentBase: path.join(process.cwd(), './dist'),
        watchContentBase: true,
        quiet: false,
        open: true,
        historyApiFallback: {
            rewrites: [{ from: /./, to: '404.html' }],
        },
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                'dist/**/*.js',
                'dist/**/*.css',
                'site/content/webpack.json',
            ],
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
});

// PROD
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',

    output: {
        filename: '[name].[hash:5].js',
        chunkFilename: '[id].[hash:5].css',
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),

            new MiniCssExtractPlugin({
                filename: '[name].[hash:5].css',
                chunkFilename: '[id].[hash:5].css',
            }),

            new OptimizeCSSAssetsPlugin({}),
        ],
    },
});
