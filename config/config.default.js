/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1664026523750_6662';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    // security: {
    //   xframe: {
    //     enable: false,
    //   },
    // }
  };

  // recommended
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/youtube-clone',
      options: {
        useUnifiedTopology: true,
      },
      // mongoose global plugins, expected a function or an array of function and options
      plugins: [
        // createdPlugin, [updatedPlugin, pluginOptions]
      ],
    },
  };

  config.security =  {
    csrf: {
      enable: false,
    }
 }

  config.middleware = ['errorHandler'];
  config.jwt = {
    secret: '05c0a221-97d9-4bb5-8844-202b6a1e32dc05c0a221-97d9-4bb5-8844-202b6a1e32dc',
    expiresIn: 606024
  }

  return {
    ...config,
    ...userConfig,
  };
};


