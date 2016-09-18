module.exports = {
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module"
  },
  "extends": "airbnb",
  "rules": {
    "jsx-filename-extension": "off",
    "comma-dangle": ["error", "never"]
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ]
};
