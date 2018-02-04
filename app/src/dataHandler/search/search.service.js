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

.service('evtSearch', ['evtSearchParser', function Search(evtSearchParser) {
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
   
   Search.prototype.handleSearchResults = function(res, currentEdition) {
      var results = '',
         content = '';
      
      if(res.length === 0) {
         results = '<p>No Results found!</p>';
      }
      else {
         var parsedDocs = evtSearchParser.parsedDocs,
            lineId;
         
         for(var i = 0; i < res.length; i++) {
            var metadata = res[i].matchData.metadata;
      
            for(var prop in metadata) {
               if(currentEdition === 'diplomatic') {
                  var diplomaticText = metadata[prop].diplomaticText;
                  if(diplomaticText !== undefined) {
                     for (var j = 0; j < diplomaticText.page.length; j++) {
                        lineId = diplomaticText.lineId[j];
                        content = '<p>'+parsedDocs[lineId].text.diplomatic+'</p><p>Found in ' + diplomaticText.docTitle[j] +
                           ' page ' + diplomaticText.page[j] + ' (line ' + diplomaticText.line[j] + ')</p>';
                        results += content;
                     }
                  }
               }
               else if(currentEdition === 'interpretative') {
                  var interpretativeText = metadata[prop].interpretativeText;
                  if(interpretativeText !== undefined) {
                     for (var z = 0; z < interpretativeText.page.length; z++) {
                        lineId = interpretativeText.lineId[z];
                        content = '<p>'+parsedDocs[lineId].text.interpretative+'</p><p>Found in ' + interpretativeText.docTitle[z] +
                           ' page ' + interpretativeText.page[z] + ' (line ' + interpretativeText.line[z] + ')</p>';
                        results += content;
                     }
                  }
               }
            }
         }
      }
      return results;
   };
}]);
