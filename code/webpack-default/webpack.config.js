const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDevelopment = process.env.NODE_ENV == 'development';
const projectPath = path.resolve(__dirname, './');
const sourcePath = path.resolve(projectPath, 'src');
const publicPath = '/';

const commonConfig = {
    entry: {
        main: path.resolve(sourcePath, 'index.js'),
    },
    output: {
        path: path.resolve(projectPath, 'dist'),
        publicPath: publicPath,
    },
    module: {
        rules: [
            {
                test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    context: 'src',
                    name() {
                        return isDevelopment
                            ? '[path][name].[ext]'
                            : '[path][name].[ext]?[contenthash]';
                    },
                },
            },
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
        new ManifestPlugin({
            sourceMap: true,
            basePath: publicPath,
            map: function(fd) {
                const index = fd.name.indexOf('?');
                fd.name = index >= 0 ? fd.name.substring(0, index) : fd.name;
                return fd;
            },
        }),
    ],
};

const devConfig = merge(commonConfig, {
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
                'dist/manifest.json',
            ],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
});

const prodConfig = merge(commonConfig, {
    mode: 'production',
    output: {
        filename: '[name].js?[contenthash]',
        chunkFilename: '[id].css?[contenthash]',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css?[contenthash]',
                chunkFilename: '[id].css?[contenthash]',
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
});

module.exports = isDevelopment ? devConfig : prodConfig;
