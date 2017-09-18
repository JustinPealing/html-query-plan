var path = require('path');
var webpack = require('webpack');

var development = process.env.NODE_ENV !== 'production';

module.exports = {
    context: __dirname,
    entry: './out/index.js',
    output: {
        library: "QP",
        libraryTarget: "umd",
        filename: development ? 'index.js' : 'index.min.js',
        path: path.join(__dirname, 'dist')
    },
    plugins: development ? [] : [
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}
