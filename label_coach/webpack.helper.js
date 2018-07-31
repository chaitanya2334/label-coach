const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = function (config, info) {
    config.plugins.push(new webpack.EnvironmentPlugin({
                                                          GA_KEY: ''
                                                      }));

    config.module = {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {test: /\.js$/, use: "babel-loader", exclude: "/node_modules/"},
            {test: /\.jsx?$/, use: "babel-loader", exclude: "/node_modules/"},
            {test: /\.svg$/, loader: 'svg-inline-loader'},
            {test: /\.json$/, use: "json-loader"}
        ]
    };

    config.devtool = 'inline-source-map';

    config.resolve = {
        extensions: ['.js', '.jsx'],
    };

    return config;
};