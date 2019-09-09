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
  settings: {
    'import/resolver': {
      node: {},
      webpack: {}
    }
  },
}
