const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
    './app/dist/searchParser.service.js'
  ],
  output: {
    path: './app/dist',
    filename: 'searchParser.service.js'
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
