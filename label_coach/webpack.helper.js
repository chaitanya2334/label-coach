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
            {test: /\.js$/, use: "babel-loader"},
            {test: /\.jsx?$/, use: "babel-loader"},
            {test: /\.svg$/, loader: 'svg-inline-loader'},
            {test: /\.json$/, use: "json-loader"}
        ]
    };
    config.plugins = [new webpack.DefinePlugin({
                                                   'process.env.NODE_ENV': '"production"'
                                               }),
        new webpack.optimize.UglifyJsPlugin({
                                                mangle: true,
                                                compress: {
                                                    warnings: false, // Suppress uglification warnings
                                                    pure_getters: true,
                                                    unsafe: true,
                                                    unsafe_comps: true,
                                                    screw_ie8: true
                                                },
                                                output: {
                                                    comments: false,
                                                },
                                                exclude: [/\.min\.js$/gi] // skip pre-minified libs
                                            }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.NoEmitOnErrorsPlugin(),
        new CompressionPlugin({
                                  asset: "[path].gz[query]",
                                  algorithm: "gzip",
                                  test: /\.js$|\.css$|\.html$/,
                                  threshold: 10240,
                                  minRatio: 0
                              })];

    config.devtool = 'inline-source-map';

    config.resolve = {
        extensions: ['.js', '.jsx'],
    };

    return config;
};