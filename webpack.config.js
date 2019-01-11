var path = require('path');
var webpack = require('webpack');

var development = process.env.NODE_ENV !== 'production';

module.exports = {
    context: __dirname,
    entry: './src/index.ts',
    output: {
        library: "QP",
        libraryTarget: "umd",
        filename: development ? 'qp.js' : 'qp.min.js',
        path: path.join(__dirname, 'dist')
    },
    optimization: {
      minimize: !development
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'ts-loader' }
      ]
    }
}