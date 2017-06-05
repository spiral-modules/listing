'use strict';

const path = require('path');
const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');


module.exports = {

  entry: {
      "sf.listing": ['./js-source/index.js']
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js',
    libraryTarget: "umd",
    library: "sf-listing",
    umdNamedDefine: true
  },

  devtool: process.env.NODE_ENV === 'production' ?
    'source-map' :
    'inline-source-map',

  resolve: {
    extensions: [
      '.js',
      '.json',
      '.less'
    ]
  },

  plugins: plugins,

  devServer: {
    historyApiFallback: {index: '/'}
  },

  module: {
    rules: [
      loaders.jsmap,
      loaders.eslint,

      loaders.js,
      loaders.less
    ]
  },
  externals: {
    "sf-core": {
      commonjs: "sf-core",
      commonjs2: "sf-core",
      amd: "sf-core",
      root: "sf"
    }
  }
};
