const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
     './app/dist/comp/searchDocument.service.js',
     './app/dist/comp/searchPoetry.service.js',
     './app/dist/comp/criticalEditionHandler.service.js',
  ],
  output: {
    path: './app/dist',
    filename: 'searchDocument.service.js'
  },
  plugins: [
  ],
  module: {
    rules: [
       {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
             loader: 'babel-loader',
             options: {
                presets: ['@babel/preset-env']
             }
          }
       }
    ]
  }
};
