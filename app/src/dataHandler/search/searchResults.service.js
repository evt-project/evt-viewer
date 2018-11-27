var Mark = require('mark.js');

angular.module('evtviewer.dataHandler')
   .service('evtSearchResults', ['evtSearchQuery', 'evtSearchIndex', 'evtSearch', 'evtSearchBox', 'Utils', 'evtBox',
      function SearchResults(evtSearchQuery, evtSearchIndex, evtSearch, evtSearchBox, Utils, evtBox) {
   
      var regex = /[.,\/#!$%\^&\*;:{}=_`~()]/;
      
      SearchResults.prototype.getSearchResults = function (inputValue, isCaseSensitive) {
         var searchResults;
         
         var input = {
            '': function () {
               searchResults = '{{ \'SEARCH.PLACEHOLDER\' | translate }}';
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
            results = {};
         
         res = makeQuery(inputValue.toLowerCase());
         res.forEach(function (result) {
            var metadata = result.matchData.metadata,
               newMetadata = {},
               resultToken,
               resultByTokenObjects;
            
            for (var token in metadata) {
               if(metadata[token].diplomaticText || metadata[token].interpretativeText) {
                  newMetadata['diplomatic'] = {};
                  newMetadata['interpretative'] = {};
                  newMetadata.diplomatic = metadata[token].diplomaticText || {};
                  newMetadata.interpretative = metadata[token].interpretativeText || {};
                  resultByTokenObjects = getResultsByToken(newMetadata);
                  
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
                     if(!results.diplomatic) {
                        results['diplomatic'] = [];
                     }
                     results['diplomatic'] = results.diplomatic.concat(resultToken.diplomatic);
                  }
                  if(resultToken.interpretative) {
                     if(!results.interpretative) {
                        results['interpretative'] = [];
                     }
                     results.interpretative = results.interpretative.concat(resultToken.interpretative);
                  }
               }
               else {
                  resultByTokenObjects = getResultsByToken(metadata[token]);
                  
                  if(isCaseSensitive) {
                     resultToken = {
                        content: getCaseSensitiveResults(inputValue, resultByTokenObjects.content)
                     };
                  }
                  else {
                     resultToken = {
                        content: getCaseInsensitiveResults(resultByTokenObjects.content)
                     };
                  }
                  if (!results.diplomatic) {
                      results['diplomatic'] = [];
                  }
                  results.diplomatic = results.diplomatic.concat(resultToken.content);
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
         var results = [],
            matchStarWildcard = inputValue.match(/[*]/);
         
         for (var token in tokenList) {
   
            if(matchStarWildcard) {
               inputValue.toLowerCase();
               var result = handleWildcardInCaseSensitive(inputValue, token, tokenList, matchStarWildcard);
               if(result) {
                  results.push(result);
               }
            }
            
            if (inputValue === token.toString()) {
               results.push(
                  {
                     token: token.toString(),
                     metadata: tokenList[token],
                     resultsNumber: tokenList[token].xmlDocId.length
                  }
               );
            }
         }
         return results;
      }
   
      function handleWildcardInCaseSensitive(inputValue, token, tokenList, matchStarWildcard) {
         var inputValueLength = inputValue.length,
            wildcardPos = matchStarWildcard.index,
            tokenFirstChars = token.toString().slice(0, wildcardPos),
            inputFirstChars = inputValue.slice(0, wildcardPos),
            tokenLastChars,
            inputLastChars,
            result = {
               token: token.toString(),
               metadata: tokenList[token],
               resultsNumber: tokenList[token].xmlDocId.length
            }
         
         //se * è alla fine
         if(inputValueLength === wildcardPos+1) {
            if(tokenFirstChars === inputFirstChars) {
               return result;
            }
         }
   
         //se * è all'inizio
         if(wildcardPos === 0) {
            tokenLastChars = token.toString().slice(-inputValueLength+1);
            inputLastChars = inputValue.slice(1, inputValueLength);
            
            if(tokenLastChars === inputLastChars) {
               return result;
            }
         }
         
         // se * è nel mezzo
         if(tokenFirstChars === inputFirstChars) {
            inputLastChars = inputValue.slice(wildcardPos + 1, inputValue.length);
            tokenLastChars = token.toString().slice(-inputLastChars.length);
            if(tokenLastChars === inputLastChars) {
               return result;
            }
         }
      }
      
      function getCaseInsensitiveResults(tokenList) {
         var results = [];
         for(var token in tokenList) {
            results.push(
               {
                  token: token.toString(),
                  metadata: tokenList[token],
                  resultsNumber: tokenList[token].xmlDocId.length
               }
         );
         }
         return results;
      }
      
      function getResultsByToken(metadata) {
         var originalTokens,
            resultPosition;
         
         if(metadata.content) {
            originalTokens = {
               content: metadata.content.originalToken
            };
            resultPosition = {
               content: originalTokens.content.map(getTokenPosition)
            };
            return {
               content: buildResultsByToken(metadata.content, resultPosition.content)
            };
         }
         
         originalTokens = {
            diplomatic: metadata.diplomatic.originalToken || [],
            interpretative: metadata.interpretative.originalToken || []
         };
         resultPosition = {
            diplomatic: originalTokens.diplomatic.map(getTokenPosition),
            interpretative: originalTokens.interpretative.map(getTokenPosition)
         };
         return {
            diplomatic: buildResultsByToken(metadata.diplomatic, resultPosition.diplomatic),
            interpretative: buildResultsByToken(metadata.interpretative, resultPosition.interpretative)
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
            },
               'critical': function () {
               var results = searchResults.interpretative || searchResults.diplomatic;
               results.forEach(function (result) {
                  currentResults.push(result);
               });
            }
            };
         
         if(Object.keys(searchResults).length !== 0){
            edition[currentEdition]();
         }
         
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
               },
               'critical': function () {
                  return parsedData[lineId].content.diplomatic || parsedData[lineId].content;
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
      
      SearchResults.prototype.highlightSearchResults = function (boxId, inputValue) {
         var currentBoxes = evtBox.getList();
         currentBoxes.forEach((box) => {
               if (box.type === 'text' || box.type === 'witness') {
                  var instance = new Mark(document.querySelector('[id="' + box.id + '"]')),
                  isCaseSensitive = evtSearchBox.getStatus(boxId, 'searchCaseSensitive');
               
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
               }
         });         
      };
      
      SearchResults.prototype.removeHighlights = function (inputValue) {
         var currentBoxes = evtBox.getList();
         currentBoxes.forEach((box) => {
               if (box.type === 'text' || box.type === 'witness') {
                  var instance = new Mark(document.querySelector('[id="' + box.id + '"]'));               
                  instance.unmark(inputValue);
               }
         });         
      };
      
      SearchResults.prototype.highlightResult = function (result, index) {
            var instance = new Mark(document.querySelector('[id="' + result.metadata.divId[index] + '"]')),
            matches = [];
            result.metadata.divId.map((id, i) => {
                  if (id === result.metadata.divId[index]) {
                        matches.push(i);
                  }
            });
            var matchIndex = matches.indexOf(index),
                  markIndex = 0,
                  regex = new RegExp("[\\s|\-|(]" + result.token +"[\\s|.|,|;|:|\\|/|\'|\"|)|?|!|\-|\`|\~|]", 'g'),
                  currentNode;

            instance.markRegExp(regex, {
                  'wildcards': 'enable',
                  'acrossElements': true,
                  'caseSensitive': false,
                  'accuracy': {
                  'value': 'partially',
                  'limiters': ['.', ',', ';', ':', '\\', '/', '!', '?', '#', '$', '%', '^', '&', '*', '{', '}', '=', '-', '_', '`', '~', '(', ')']
                  },
                  'filter': function(node) {
                        markIndex++;
                        if ((markIndex - 1) === matchIndex) {
                              currentNode = node;
                        }
                        return (markIndex - 1) === matchIndex;
                  }
            });
            return currentNode;
      };
   }]);
