const commonConfig = require("./common.config.js");
const merge = require("webpack-merge");

module.exports = merge(commonConfig, {
    mode: "development",
    devtool: "eval-source-map",
    watch: true,
    devServer: {
        contentBase: "./dist",
    }
});
