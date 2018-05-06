var Mark = require('mark.js');

angular.module('evtviewer.dataHandler')
   .service('evtSearchResults', ['evtSearchQuery', 'evtSearchIndex', 'evtSearch', function SearchResults(evtSearchQuery, evtSearchIndex, evtSearch) {
      
      SearchResults.prototype.getSearchResults = function (inputValue) {
         var searchResults;
         
         var input = {
            '': function () {
               searchResults = 'Enter your query into the search box above';
            },
            'default': function () {
               searchResults = getResultsMetadata(inputValue);
            }
         };
         (input[inputValue] || input['default'])();
         return searchResults;
      };
      
      SearchResults.prototype.getVisibleResults = function (currentEditionResults) {
         var visibleRes = [];
         var j = 0;
         
         while (j < 20 && j < currentEditionResults.length) {
            visibleRes.push(currentEditionResults[j]);
            j++;
         }
         return visibleRes;
      };
      
      function getQueryResults(inputValue) {
         var index = evtSearchIndex.getIndex();
         return evtSearchQuery.query(index, inputValue);
      }
      
      function getResultsMetadata(inputValue) {
         var res = getQueryResults(inputValue);
         var diplResult = {},
            interprResult = {};
         
         var results = {
            diplomatic: [],
            interpretative: []
         };
         
         res.forEach(function (result) {
            var metadata = result.matchData.metadata;
            for (var token in metadata) {
               if (metadata[token].diplomaticText) {
                  diplResult = {
                     token: token,
                     diplomaticText: metadata[token].diplomaticText,
                     resultsNumber: metadata[token].diplomaticText.page.length
                  }
                  results.diplomatic.push(diplResult);
               }
               if (metadata[token].interpretativeText) {
                  interprResult = {
                     token: token,
                     interpretativeText: metadata[token].interpretativeText,
                     resultsNumber: metadata[token].interpretativeText.page.length
                  }
                  results.interpretative.push(interprResult);
               }
               if (metadata[token].content) {
                  diplResult = {
                     token: token,
                     diplomaticText: metadata[token].content,
                     resultsNumber: metadata[token].content.page.length
                  }
                  results.diplomatic.push(diplResult);
               }
            }
         });
         
         return results;
      }
      
      SearchResults.prototype.getCurrentEditionResults = function (searchResults, currentEdition) {
         var currentResults = [];
         var edition = {
            'diplomatic': function () {
               var diplomaticResults = searchResults.diplomatic;
               diplomaticResults.forEach(function (result) {
                  currentResults.push(result);
               });
            },
            'interpretative': function () {
               var interpretativeResults = searchResults.interpretative;
               interpretativeResults.forEach(function (result) {
                  currentResults.push(result);
               });
            }
         };
         edition[currentEdition]();
         return currentResults;
      };
      
      SearchResults.prototype.getOriginalText = function (lineId, currentEdition) {
         var parsedData = evtSearch.getParsedElementsForIndexing();
         
         var edition = {
            'diplomatic': function () {
               return parsedData[lineId].content.diplomatic || parsedData[lineId].content;
            },
            'interpretative': function () {
               return parsedData[lineId].content.interpretative;
            }
         };
         return edition[currentEdition]();
      };
      
      SearchResults.prototype.getTextPreview = function(highlightedText, replace) {
         var splitText = highlightedText.split(/\s+/),
            replaceIndex = splitText.indexOf(replace),
            textBeforeReplace,
            textAfterReplace,
            textPreview;
         
         textAfterReplace = splitText.slice(replaceIndex, replaceIndex + 10);
         textBeforeReplace = replaceIndex < 10 ? splitText.slice(0, replaceIndex)
                           : splitText.slice(replaceIndex - 10, replaceIndex);
         
         textPreview = textBeforeReplace.length < 10 ? textBeforeReplace.join(' ') + ' ' + textAfterReplace.join(' ') + '...'
                           : '...' + textBeforeReplace.join(' ') + ' ' + textAfterReplace.join(' ') + '...';
         
         if(splitText.length < 15) {
            textPreview = textBeforeReplace.join(' ') + ' ' + textAfterReplace.join(' ');
         }
         
         return textPreview;
      };
      
      SearchResults.prototype.highlightSearchResults = function (inputValue) {
         var instance = new Mark(document.querySelector('#mainContentToTranform'));
         instance.unmark(inputValue);
         instance.mark(inputValue, {
            'wildcards': 'enable',
            'acrossElements': true,
            'caseSensitive': true,
            'accuracy': {
               'value': 'exactly',
               'limiters': ['.', ',', ';', ':', '\\', '/', '!', '?', '#', '$', '%', '^', '&', '*', '{', '}', '=', '-', '_', '`', '~', '(', ')']
            },
            'filter': function() {
               var regex = /[.,\/#!$%\^&\*;:{}=_`~()]/;
               return inputValue.match(regex) ? false : true;
            }
         });
      };
   }]);
