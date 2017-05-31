const path = require('path');
const { makeStyleLoaders } = require('../webpack/makeConfig');
// Export a function. Accept the base config as the only param.
module.exports = function (storybookBaseConfig, configType) {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  storybookBaseConfig.module.rules.push({
    test: /\.scss$/,
    loaders: ["style-loader", "css-loader", "sass-loader"],
    include: path.resolve(__dirname, '../')
  });

  storybookBaseConfig.module.rules.push(...makeStyleLoaders({ isDevelopment: true }));

  storybookBaseConfig.module.rules.push({
    test: /\.(eot|ttf|woff|woff2|svg)(\?.+)?$/,
    loader: 'url-loader',
    options: {
      name: '../fonts/[name].[ext]',
      // load fonts through data-url in development
      limit: 5000000,
    },
  });

  storybookBaseConfig.module.rules.push({
    test: /\.png$/,
    loader: 'file-loader',
  })

  // Return the altered config
  return storybookBaseConfig;
};
