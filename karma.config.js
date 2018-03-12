var webpackConfig = require('./webpack.config');
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/*_test.ts'
    ],
    exclude: [],
    preprocessors: {
      'test/**/*_test.ts': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      devtool: 'inline-source-map'
    },
    mime: {
      "text/x-typescript": ["ts"]
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Firefox'],
    //browsers: ['Chrome', 'Firefox', 'IE', 'IE9'],
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