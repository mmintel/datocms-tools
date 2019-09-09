module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [ 'eslint:recommended', 'airbnb'],
  plugins: ['jest'],
  rules: {
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0
  },
  settings: {
    'import/resolver': {
      node: {},
      webpack: {}
    }
  },
}
