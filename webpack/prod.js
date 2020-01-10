const commonConfig = require("./common.js");
const merge = require("webpack-merge");

const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(commonConfig, {
    mode: "production",
    optimization: {
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
    },
});
