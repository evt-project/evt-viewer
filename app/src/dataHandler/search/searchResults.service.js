var Mark = require('mark.js');

angular.module('evtviewer.dataHandler')

.service('evtSearchResults', ['evtSearchParser', function SearchResults(evtSearchParser) {
   
   function renderDiplomaticResults(metadata, inputValue) {
      var resList = [],
         resultId,
         text = '',
         results = '',
         content = '',
         parsedDocs = evtSearchParser.parsedDocs;
   
      for(var prop in metadata) {
         var diplomaticText = metadata[prop].diplomaticText;
         
         if (diplomaticText !== undefined) {
            for (var i = 0; i < diplomaticText.page.length; i++) {
               resultId = diplomaticText.lineId[i];
               text = parsedDocs[resultId].text.diplomatic;
               text = text.replace(inputValue, '<strong>' + inputValue + '</strong>');
         
               if (diplomaticText.paragraph[i] !== undefined) {
                  content = '<div class="search-result" id="' + resultId + '">' +
                     '<p><span class="original-text">' + text + '</span>' +
                     '<a class="resultInfo" href="" ng-click="vm.goToAnchor()">Found in ' +
                     '<span id="' + diplomaticText.docId[i] + '" class="resultDoc">' + diplomaticText.docTitle[i] + '</span>' +
                     ' page <span id="' + diplomaticText.pageId[i] + '" class="resultPage">' + diplomaticText.page[i] + '</span> ' +
                     ' paragraph ' + diplomaticText.paragraph[i] + ' (line ' + diplomaticText.line[i] + ')</a></p></div>';
               }
               else {
                  content = '<div class="search-result" id="' + resultId + '">' +
                     '<p><span class="original-text">' + text + '</span>' +
                     '<a class="resultInfo" href="" ng-click="vm.goToAnchor()">Found in ' +
                     '<span id="' + diplomaticText.docId[i] + '" class="resultDoc">' + diplomaticText.docTitle[i] + '</span>' +
                     ' page <span id="' + diplomaticText.pageId[i] + '" class="resultPage">' + diplomaticText.page[i] + '</span> ' +
                     ' (line ' + diplomaticText.line[i] + ')</a></p></div>';
               }
         
               results += content;
               resList.push(content);
            }
         }
      }
      return resList;
   }
   
   function renderInterpretativeResults(metadata, inputValue) {
      var resList = [],
         resultId,
         text = '',
         results = '',
         content = '',
         parsedDocs = evtSearchParser.parsedDocs;
   
      for(var prop in metadata) {
         var interpretativeText = metadata[prop].interpretativeText;
         if(interpretativeText !== undefined) {
            for (var i = 0; i < interpretativeText.page.length; i++) {
               resultId = interpretativeText.lineId[i];
               text = parsedDocs[resultId].text.interpretative;
               text = text.replace(inputValue, '<strong>' + inputValue + '</strong>');
         
               if(interpretativeText.paragraph[i] !== undefined) {
                  content = '<div class="search-result" id="' + resultId + '">' +
                     '<p><span class="original-text">' + text + '</span>' +
                     '<a class="resultInfo" href="" ng-click="vm.goToAnchor()">Found in ' +
                     '<span id="' + interpretativeText.docId[i] + '" class="resultDoc">' + interpretativeText.docTitle[i] + '</span>' +
                     ' page <span id="'+interpretativeText.pageId[i]+'" class="resultPage">' + interpretativeText.page[i] + '</span> ' +
                     ' paragraph ' + interpretativeText.paragraph[i] + ' (line ' + interpretativeText.line[i] + ')</a></p></div>';
               }
               else {
                  content = '<div class="search-result" id="' + resultId + '">' +
                     '<p><span class="original-text">' + text + '</span>' +
                     '<a class="resultInfo" href="" ng-click="vm.goToAnchor()">Found in ' +
                     '<span id="' + interpretativeText.docId[i] + '" class="resultDoc">' + interpretativeText.docTitle[i] + '</span>' +
                     ' page <span id="'+interpretativeText.pageId[i]+'" class="resultPage">' + interpretativeText.page[i] + '</span> ' +
                     ' (line ' + interpretativeText.line[i] + ')</a></p></div>';
               }
         
               results += content;
               resList.push(content);
            }
         }
      }
      return resList;
   }
   
   SearchResults.prototype.renderSearchResults = function(inputValue, res, currentEdition) {
      var resList = [],
         metadata,
         resultsNumber = 0,
         searchInfo;
      
      for(var i = 0; i < res.length; i++) {
         metadata = res[i].matchData.metadata;
         if(currentEdition === 'diplomatic') {
            resList = renderDiplomaticResults(metadata, inputValue);
            resultsNumber = resList.length;
         }
         else if(currentEdition === 'interpretative') {
            resList = renderInterpretativeResults(metadata, inputValue);
            resultsNumber = resList.length;
         }
      }
      
      searchInfo = '<div class="search-info"><p>Search for <strong>' + inputValue + '</strong></p>' +
         '<p>We have found ' + resultsNumber + ' results in the selected edition.</p></div>';
      
      resList.unshift(searchInfo);
      return resList;
   };
   
   SearchResults.prototype.highlightSearchResults = function(inputValue) {
      var instance = new Mark(document.querySelector('#mainContentToTranform'));
      instance.unmark(inputValue);
      instance.mark(inputValue, {
         'wildcards': 'enabled'
      });
   };
}]);
