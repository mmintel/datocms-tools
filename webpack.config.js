const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.min.js',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'lib'),
      '~': path.resolve(__dirname, 'lib'),
    },
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: true,
    })],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
