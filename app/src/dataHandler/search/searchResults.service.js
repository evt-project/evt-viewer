var Mark = require('mark.js');

angular.module('evtviewer.dataHandler')
   .service('evtSearchResults', ['evtSearchQuery', 'evtSearchIndex', 'evtSearch', 'evtSearchBox', 'Utils',
      function SearchResults(evtSearchQuery, evtSearchIndex, evtSearch, evtSearchBox, Utils) {
   
      var regex = /[.,\/#!$%\^&\*;:{}=_`~()]/;
      
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
         var visibleRes = [],
            j = 0;
         
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
            results = {
               diplomatic: [],
               interpretative: []
            };
         
         res = makeQuery(inputValue.toLowerCase());
         res.forEach(function (result) {
            var metadata = result.matchData.metadata,
               diplomaticMetadata,
               interpretativeMetadata,
               resultToken,
               resultByTokenObjects;
            
            for (var token in metadata) {
               diplomaticMetadata = metadata[token].diplomaticText || {};
               interpretativeMetadata = metadata[token].interpretativeText || {};
               resultByTokenObjects = getResultsByToken(diplomaticMetadata, interpretativeMetadata);
               
               if(isCaseSensitive) {
                  resultToken = {
                     diplomatic: getCaseSensitiveResults(inputValue, resultByTokenObjects.diplomatic),
                     interpretative: getCaseSensitiveResults(inputValue, resultByTokenObjects.interpretative)
                  };
               }
               else {
                  resultToken = {
                     diplomatic: getCaseInsensitiveResults(resultByTokenObjects.diplomatic),
                     interpretative: getCaseInsensitiveResults(resultByTokenObjects.interpretative)
                  };
               }
               
               if(resultToken.diplomatic) {
                  results.diplomatic = results.diplomatic.concat(resultToken.diplomatic);
               }
               if(resultToken.interpretative) {
                  results.interpretative = results.interpretative.concat(resultToken.interpretative);
               }
            }
         });
         
         return results;
      }
      
      function makeQuery(inputValue) {
         var index = getIndex();
         return evtSearchQuery.query(index, inputValue);
      }
      
      function getCaseSensitiveResults(inputValue, tokenList) {
         var results = [];
         for (var token in tokenList) {
            if (inputValue === token.toString()) {
               results.push(
                  {
                     token: token.toString(),
                     diplomaticText: tokenList[token],
                     resultsNumber: tokenList[token].xmlDocId.length
                  }
               );
            }
         }
         return results;
      }
      
      function getCaseInsensitiveResults(tokenList) {
         var results = [];
         for(var token in tokenList) {
            results.push(
               {
                  token: token.toString(),
                  diplomaticText: tokenList[token],
                  resultsNumber: tokenList[token].xmlDocId.length
               }
         );
         }
         return results;
      }
      
      function getResultsByToken(diplomaticMetadata, interpretativeMetadata) {
         var originalTokens,
            resultPosition;
         
         originalTokens = {
            diplomatic: diplomaticMetadata.originalToken || [],
            interpretative: interpretativeMetadata.originalToken || []
         };
         resultPosition = {
            diplomatic: originalTokens.diplomatic.map(getTokenPosition),
            interpretative: originalTokens.interpretative.map(getTokenPosition)
         };
         
         return {
            diplomatic: buildResultsByToken(diplomaticMetadata, resultPosition.diplomatic),
            interpretative: buildResultsByToken(interpretativeMetadata, resultPosition.interpretative)
         };
      }
   
      function getTokenPosition(token, resultPosition) {
         return {
            token: token,
            position: resultPosition
         };
      }
      
      function buildResultsByToken (metadata, resultPosition) {
         var result = {},
            originalToken,
            filteredMetadata = {},
            noTokenInResult;
         
         for (var i = 0; i < resultPosition.length; i++) {
            originalToken = resultPosition[i].token;
            noTokenInResult = !result[resultPosition[i].token];
      
            for (var m in metadata) {
               filteredMetadata[m.toString()] = metadata[m].filter(getRightMetadata, resultPosition[i]);
            }
      
            if (noTokenInResult) {
               result[originalToken] = filteredMetadata;
               filteredMetadata = {};
            }
            else {
               for (var fm in filteredMetadata) {
                  result[originalToken][fm].push(filteredMetadata[fm][0]);
               }
            }
         }
         return result;
      }
      
      function getRightMetadata(metadata, position) {
         return this.position === position;
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
               return inputValue.match(regex) ? false : true;
            }
         });
      };
   }]);
