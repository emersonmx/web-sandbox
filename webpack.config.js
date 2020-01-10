const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpackNotifierPlugin = new WebpackNotifierPlugin({ alwaysNotify: true });
const cleanWebpackPlugin = new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['main.*', 'manifest.json'],
});

const isProduction = process.env.NODE_ENV == 'production';

const commonConfig = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new webpack.ProgressPlugin(),
        cleanWebpackPlugin,
        webpackNotifierPlugin,
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
};

const devConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist',
    },
    output: {
        filename: 'main.js',
    },
    plugins: [new MiniCssExtractPlugin({ filename: 'main.css' })],
});

const prodConfig = merge(commonConfig, {
    mode: 'production',
    optimization: {
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    },
    output: {
        filename: 'main.[contenthash].js',
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'main.[contenthash].css' }),
        new ManifestPlugin(),
    ],
});

module.exports = isProduction ? prodConfig : devConfig;
