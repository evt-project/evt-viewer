var lunr = require('lunr');
var Mark = require('mark.js');

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
   
   Search.prototype.handleSearchResults = function(inputValue, res, currentEdition) {
      var results = '',
         resList = [],
         content = '',
         countResults = 0,
         parsedDocs = evtSearchParser.parsedDocs,
         lineId,
         text,
         searchInfo;
      
      for(var i = 0; i < res.length; i++) {
         var metadata = res[i].matchData.metadata;
      
         for(var prop in metadata) {
            if(currentEdition === 'diplomatic') {
               var diplomaticText = metadata[prop].diplomaticText;
               if(diplomaticText !== undefined) {
                  for (var j = 0; j < diplomaticText.page.length; j++) {
                     lineId = diplomaticText.lineId[j];
                     text = parsedDocs[lineId].text.diplomatic;
                     text = text.replace(inputValue, '<strong>' + inputValue + '</strong>');
                     
                     content = '<div class="search-result"><p><span class="original-text">' + text + '</span><span>Found in ' + diplomaticText.docTitle[j] +
                           ' page ' + diplomaticText.page[j] + ' (line ' + diplomaticText.line[j] + ')</span></p></div>';
                     results += content;
                     resList.push(content);
                     countResults++;
                  }
               }
            }
            else if(currentEdition === 'interpretative') {
               var interpretativeText = metadata[prop].interpretativeText;
               if(interpretativeText !== undefined) {
                  for (var z = 0; z < interpretativeText.page.length; z++) {
                     lineId = interpretativeText.lineId[z];
                     text = parsedDocs[lineId].text.interpretative;
                     text = text.replace(inputValue, '<strong>' + inputValue + '</strong>');
                     
                     content = '<div class="search-result"><p><span class="original-text">' + text + '</span><span>Found in ' + interpretativeText.docTitle[z] +
                           ' page ' + interpretativeText.page[z] + ' (line ' + interpretativeText.line[z] + ')</span></p></div>';
                     results += content;
                     resList.push(content);
                     countResults++;
                  }
               }
            }
         }
      }
      
      searchInfo = '<div class="search-info"><p>Search for <strong>' + inputValue + '</strong></p><p>We have found ' + countResults +
         ' results in the selected edition.</p></div>';
         
      resList.unshift(searchInfo);
      
      return resList;
   };
   
   Search.prototype.highlightSearchResults = function(inputValue) {
      var instance = new Mark(document.querySelector('#mainContentToTranform'));
      instance.unmark(inputValue);
      instance.mark(inputValue);
   };
}]);
