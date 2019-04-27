angular.module('evtviewer.dataHandler')
   .service('evtSearch', ['evtSearchDocument', 'evtBuilder', 'evtSearchIndex', 'Utils',
      function Search(evtSearchDocument, evtBuilder, evtSearchIndex, Utils) {
      var prevDocsLines = 0,
         parsedElementsForIndexing = {};
      
      Search.prototype.initSearch = function (xmlDocDom) {
         console.time('PARSING TIME');
         
         var parsedElements,
            searchParser = {},
            xmlDocsBody = evtSearchDocument.getXmlDocBody(xmlDocDom),
            index,
            stringifyIndex,
            stringifyParsedElementsForIndexing;
         
         evtSearchDocument.removeNoteElements(xmlDocDom);
         evtSearchDocument.removeAddElements(xmlDocDom);
         
         for (var i = 0; i < xmlDocsBody.length; i++) {
            searchParser = evtBuilder.createParser(xmlDocsBody[i]);
            parsedElements = searchParser.parseElements(prevDocsLines);
            prevDocsLines = searchParser.getPrevDocsLines();
            parsedElementsForIndexing = angular.extend(parsedElementsForIndexing, parsedElements);
         }
   
         console.timeEnd('PARSING TIME');
         console.log(parsedElementsForIndexing);
         
         index = evtSearchIndex.createIndex(parsedElementsForIndexing);
         
         stringifyIndex = JSON.stringify(index);
         stringifyParsedElementsForIndexing = JSON.stringify(parsedElementsForIndexing);
         Utils.compressAndSaveFile(stringifyIndex, 'index');
         Utils.compressAndSaveFile(stringifyParsedElementsForIndexing, 'parsedElements');
      };
      
      Search.prototype.getParsedElementsForIndexing = function () {
         return parsedElementsForIndexing;
      };
      
      Search.prototype.loadParsedElementsForIndexing = function () {
         var serializedElements = window.localStorage.getItem('parsedElements.txt');
         parsedElementsForIndexing = JSON.parse(serializedElements);
         return parsedElementsForIndexing;
      };
      
      Search.prototype.getPrevDocsLines = function () {
         return prevDocsLines;
      };
      
   }]);
