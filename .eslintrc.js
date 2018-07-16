const OFF = 0;
const ERROR = 2;

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  rules: {
    'react/jsx-filename-extension': [ERROR, { extensions: ['.js'] }],
    'import/no-extraneous-dependencies': [
      ERROR,
      {
        devDependencies: [
          '**/__tests__/*.js',
          'scripts/**/*.js',
          'webpack/**/*.js',
          'src/client/stories/**/*.js',
        ],
      },
    ],
    'no-console': OFF,
    'global-require': OFF,
    // Allow mixed linebreaks locally, but commit only LF.
    'linebreak-style': process.env.CI ? ['error', 'unix'] : OFF,
  },
};
