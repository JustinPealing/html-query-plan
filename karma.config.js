var webpackConfig = require('./webpack.config.js'); 
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/*_test.js'
    ],
    exclude: [],
    preprocessors: {
      'test/*_test.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      module: webpackConfig.module,
      devtool: 'inline-source-map'
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Firefox', 'IE', 'IE9'],
    customLaunchers: {
      IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9'
      }
    },
    singleRun: false,
    concurrency: Infinity
  })
}