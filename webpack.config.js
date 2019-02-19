const path = require('path');

module.exports = {
   devtool: 'source-map',
   entry: [
      './app/src/dataHandler/search/searchIndex.service.js',
      './app/src/dataHandler/search/searchQuery.service.js',
      './app/src/dataHandler/search/searchResults.service.js'
   ],
   output: {
      path: './app/dist',
      filename: 'search.service.js'
   }
};
