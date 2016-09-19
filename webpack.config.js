var path = require('path');
var webpack = require('webpack');

var development = process.env.NODE_ENV !== 'production';

module.exports = {
    context: __dirname,
    entry: './src/qp.js',
    output: {
        library: "QP",
        libraryTarget: "umd",
        filename: development ? 'qp.js' : 'qp.min.js',
        path: path.join(__dirname, 'lib')
    },
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
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
                    presets: ['es2015'],
                    plugins: [
                        "transform-es3-member-expression-literals",
                        "transform-es3-property-literals"
                    ]
                }
            }
        ]
    }
}