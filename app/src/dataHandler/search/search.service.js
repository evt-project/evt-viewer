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
   
   Search.prototype.query = function(index, token) {
      var result = index.query(function(q) {
         q.term(token, {
            usePipeline: false,
            wildcard: lunr.Query.wildcard.TRAILING
         });
      });
      return result;
   };
   
   Search.prototype.handleSearchResults = function(res, currentEdition) {
      var diplomaticText,
         interpretativeText;
      
      console.log('Results', res);
      
      for(var i = 0; i < res.length; i++) {
         var metadata = res[i].matchData.metadata;
   
         for(var prop in metadata) {
            if(currentEdition === 'diplomatic') {
               diplomaticText = metadata[prop].diplomaticText;
               if(diplomaticText !== undefined) {
                  for (var j = 0; j < diplomaticText.page.length; j++) {
                     console.log('Found in:\n page: ' + diplomaticText.page[j] + '\n line: ' + diplomaticText.line[j]);
                  }
               }
               else {
                  console.log('No results!');
               }
            }
            else if(currentEdition === 'interpretative') {
               interpretativeText = metadata[prop].interpretativeText;
               if(interpretativeText !== undefined) {
                  for (var z = 0; z < interpretativeText.page.length; z++) {
                     console.log('Found in:\n page: ' + interpretativeText.page[z] + '\n line: ' + interpretativeText.line[z]);
                  }
               }
               else {
                  console.log('No results!');
               }
            }
         }
      }
   };
});
