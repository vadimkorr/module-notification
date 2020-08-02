// Karma configuration

module.exports = function(config) {
  var configuration = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // plugins starting with karma- are autoloaded
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
    ],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    browserify: {
      debug: true,
    },

    // list of files / patterns to load in the browser
    files: [
      './utils.js',
      './spec/*.spec.js',
      'https://cdn.jsdelivr.net/npm/module-notification/dist/index.js',
      // uncomment for development:
      // '../dist/index.js',
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],

    // e.g see https://swizec.com/blog/how-to-run-javascript-tests-in-chrome-on-travis/swizec/6647
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Firefox',
        flags: ['--no-sandbox'],
      },
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    failOnEmptyTestSuite: false,
  }

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci']
  }

  config.set(configuration)
}
