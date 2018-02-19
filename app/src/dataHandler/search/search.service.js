var lunr = require('lunr');

/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.search.evtSearch
 * @description
 * # evtSearch
 * In this service is defined a constructor and his objects. The objects exposed methods to handle search feature.
 *
 * @requires evtviewer.dataHandler.search.evtSearchParser
 *
 * @author GC
 */
angular.module('evtviewer.dataHandler')

.service('evtSearch', function Search() {
   var searchResults;
   
   Search.prototype.query = function(index, token, doc) {
      searchResults = index.query(function(q) {
         q.term(token, {
            usePipeline: false,
            wildcard: lunr.Query.wildcard.TRAILING,
            ref: doc
         });
      });
      return searchResults;
   };
   
   
});
