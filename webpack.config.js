const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
     './app/src/dataHandler/search/searchIndex.service.js',
     './app/src/dataHandler/search/search.service.js',
     './app/src/dataHandler/search/searchResults.service.js'
  ],
  output: {
    path: './app/dist',
    filename: 'search.service.js'
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
