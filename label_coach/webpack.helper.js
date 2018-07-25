var webpack = require('webpack');

module.exports = function (config, info) {
    config.plugins.push(new webpack.EnvironmentPlugin({
                                                          GA_KEY: ''
                                                      }));

    config.module = {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                    ]
            },
            {test: /\.js$/, use: "babel-loader"},
            {test: /\.jsx?$/, use: "babel-loader"},
            {test: /\.svg$/, loader: 'svg-inline-loader'}
        ]
    };

    config.devtool = 'inline-source-map';

    config.resolve = {
        extensions: ['.js', '.jsx'],
    };

    return config;
};