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
   .service('evtSearchQuery', function Search() {
      var searchResults,
         tokens;
      
      Search.prototype.query = function (index, token) {
         tokens = lunr.tokenizer(token);
         
         searchResults = index.query(function (q) {
            q.term(tokens, {
               usePipeline: false,
               wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
            });
         });
         
         return searchResults;
      };
      
      Search.prototype.exactMatchQuery = function (index, token) {
         tokens = token.match('-') ? token : lunr.tokenizer(token);
        
         searchResults = index.query(function (q) {
            q.term(tokens, {
               usePipeline: false
            });
         });
         
         return searchResults;
      };
      
   });
