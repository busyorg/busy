const path = require('path');

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

  storybookBaseConfig.module.rules.push({
    test: /\.less$/,
    use: [
      require.resolve('style-loader'),
      require.resolve('css-loader'),
      //  {
      //    loader: require.resolve('postcss-loader'),
      //    options: {
      //      ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
      //      plugins: () => [
      //        require('postcss-flexbugs-fixes'),
      //        autoprefixer({
      //          browsers: [
      //            '>1%',
      //            'last 4 versions',
      //            'Firefox ESR',
      //            'not ie < 9', // React doesn't support IE8 anyway
      //          ],
      //          flexbox: 'no-2009',
      //        }),
      //      ],
      //    },
      //  },
      require.resolve('less-loader'),
    ],
  });

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
