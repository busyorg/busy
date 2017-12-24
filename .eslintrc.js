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
  extends: 'airbnb',
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/__tests__/*.js', 'scripts/**/*.js'] },
    ],
    'no-console': 'off',
  },
};
