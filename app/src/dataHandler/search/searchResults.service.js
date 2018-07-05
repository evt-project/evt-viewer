var Mark = require('mark.js');

angular.module('evtviewer.dataHandler')
   .service('evtSearchResults', ['evtSearchQuery', 'evtSearchIndex', 'evtSearch', 'evtSearchBox', 'Utils',
      function SearchResults(evtSearchQuery, evtSearchIndex, evtSearch, evtSearchBox, Utils) {
      
      SearchResults.prototype.getSearchResults = function (inputValue, isCaseSensitive) {
         var searchResults;
         
         var input = {
            '': function () {
               searchResults = 'Enter your query into the search box above';
            },
            'default': function () {
               searchResults = getResultsMetadata(inputValue, isCaseSensitive);
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
      
      function getIndex() {
         return evtSearchIndex.getIndex();
      }
      
      function getResultsMetadata(inputValue, isCaseSensitive) {
         var res,
            results,
            diplResult = {},
            interprResult = {};
         
         results = {
            diplomatic: [],
            interpretative: []
         };
         
         res = isCaseSensitive ? getCaseSensitiveResults(inputValue) : getCaseInsensitiveResults(inputValue);
         res.forEach(function (result) {
            var metadata = result.matchData.metadata;
            for (var token in metadata) {
               if (metadata[token].diplomaticText) {
                  diplResult = {
                     token: token,
                     diplomaticText: metadata[token].diplomaticText,
                     resultsNumber: metadata[token].diplomaticText.xmlDocId.length
                  }
                  results.diplomatic.push(diplResult);
               }
               if (metadata[token].interpretativeText) {
                  interprResult = {
                     token: token,
                     interpretativeText: metadata[token].interpretativeText,
                     resultsNumber: metadata[token].interpretativeText.xmlDocId.length
                  }
                  results.interpretative.push(interprResult);
               }
               if (metadata[token].content) {
                  diplResult = {
                     token: token,
                     diplomaticText: metadata[token].content,
                     resultsNumber: metadata[token].content.xmlDocId.length
                  }
                  results.diplomatic.push(diplResult);
               }
            }
         });
         
         return results;
      }
      
      function getCaseSensitiveResults(inputValue) {
         var index = getIndex();
         return evtSearchQuery.query(index, inputValue);
      }
   
      function getCaseInsensitiveResults(inputValue) {
         var index = getIndex(),
            result = [];
      
         for(var token in index.invertedIndex) {
            if(token.toLowerCase() === inputValue.toLowerCase()) {
               result = result.concat(evtSearchQuery.query(index, token));
            }
         }
      
         return result;
      }
      
      SearchResults.prototype.getCurrentEditionResults = function (searchResults, currentEdition) {
         var currentResults = [],
            edition = {
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
         var parsedData = evtSearch.getParsedElementsForIndexing(),
            edition = {
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
         var splitText = highlightedText.split(/[\s]+/),
            replaceIndex,
            textBeforeReplace,
            textAfterReplace,
            textPreview,
            i = 0;
         
         while(Utils.cleanPunctuation(splitText[i]) !== replace && i < splitText.length -1) {
            replaceIndex = i;
            i++;
         }
         
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
      
      SearchResults.prototype.highlightSearchResults = function (mainBoxId, inputValue) {
         var instance = new Mark(document.querySelector('#' + mainBoxId + ' #mainContentToTranform')),
            isCaseSensitive = evtSearchBox.getStatus(mainBoxId, 'searchCaseSensitive');
         
         instance.unmark(inputValue);
         instance.mark(inputValue, {
            'wildcards': 'enable',
            'acrossElements': true,
            'caseSensitive': isCaseSensitive,
            'accuracy': {
               'value': 'partially',
               'limiters': ['.', ',', ';', ':', '\\', '/', '!', '?', '#', '$', '%', '^', '&', '*', '{', '}', '=', '-', '_', '`', '~', '(', ')']
            },
            'filter': function() {
               var regex = /[.,\/#!$%\^&\*;:{}=_`~()]/;
               return inputValue.match(regex) ? false : true;
            }
         });
      };
   }]);
