const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const projectPath = path.resolve(__dirname, '../');
const sourcePath = path.resolve(projectPath, 'src');
const publicPath = '/';

module.exports = {
    entry: {
        main: path.resolve(sourcePath, 'main.js'),
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
                    // name: '[path][name].[ext]?[contenthash]',
                    name(_path, _query) {
                        if (process.env.NODE_ENV === 'development') {
                            return '[path][name].[ext]';
                        }

                        return '[path][name].[ext]?[contenthash]';
                    },
                    context: 'src',
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
        }),

        new CopyWebpackPlugin([
            // {
            //     from: 'src/fonts/',
            //     to: 'fonts/',
            //     context: projectPath,
            // },
        ]),
    ],
};
