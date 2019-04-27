const path = require('path');

module.exports = {
   devtool: 'source-map',
   entry: {
      utils: './app/src/core/utils.provider.js',
      search : [
         './app/src/dataHandler/search/searchIndex.service.js',
         './app/src/dataHandler/search/searchQuery.service.js',
         './app/src/dataHandler/search/searchResults.service.js'
      ]
   },
   output: {
      filename: '[name].js',
      path: __dirname + '/app/dist'
   }
};
