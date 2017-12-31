const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
     './app/src/dataHandler/search/searchDocument.service.js',
  ],
  output: {
    path: './app/dist',
    filename: 'searchDocument.service.js'
  },
  plugins: [],
  module: {
    rules: [
       {
          test: /\.js$/,
          //exclude: /(node_modules|bower_components)/,
          /*use: {
             loader: 'babel-loader',
             options: {
                presets: ['@babel/preset-env']
             }
          }*/
       }
    ]
  }
};
