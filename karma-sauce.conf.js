var baseConfig = require('./karma.conf.js');
module.exports = function(config) {
    baseConfig(config);
    var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '35'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '26'
    }//,
    // 'SL_Safari': {
    //   base: 'SauceLabs',
    //   browserName: 'safari',
    //   platform: 'OS X 10.9',
    //   version: '7'
    // }
  };
  config.set({
    sauceLabs: {
      testName: 'Hint Log Unit Tests',
      startConnect: true,
      options: {
        'idle-timeout': 500,
        'selenium-version': '2.37.0'
      }
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['dots', 'saucelabs'],
    singleRun: true
  });
  if (process.env.TRAVIS) {
    config.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;

    process.env.SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY.split('').reverse().join('');

    // TODO(vojta): remove once SauceLabs supports websockets.
    // This speeds up the capturing a bit, as browsers don't even try to use websocket.
    config.transports = ['xhr-polling'];
  }
};