const webpack = require('webpack');

module.exports = function (config, info) {
    config.plugins.push(new webpack.EnvironmentPlugin({
                                                          GA_KEY: ''
                                                      }));
    config.plugins.push(new webpack.ProvidePlugin({
                                                      'window.Buffer': 'buffer'
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

    config.resolve = {
        extensions: ['.js', '.jsx'],
    };

    return config;
};