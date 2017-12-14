const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
     './app/dist/comp/searchDocument.service.js',
     './app/dist/comp/searchPoetry.service.js'
  ],
  output: {
    path: './app/dist',
    filename: 'searchDocument.service.js'
  },
  plugins: [
  ],
  module: {
    loaders: [
      {
         test: /\.js$/,
         loader: 'babel',
         include: path.join(__dirname, 'src')
      }
    ]
  }
};
