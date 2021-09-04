angular.module('evtviewer.dataHandler')
   .service('evtSearch', ['evtSearchDocument', 'evtBuilder', 'evtSearchIndex', 'Utils', 'GLOBALDEFAULTCONF',
      function Search(evtSearchDocument, evtBuilder, evtSearchIndex, Utils, GLOBALDEFAULTCONF) {
      var prevDocsLines = 0,
         parsedElementsForIndexing = {},
         indexFileName = GLOBALDEFAULTCONF.indexFileName,
         parsedElementsFileName = GLOBALDEFAULTCONF.indexDocumentFileName;

      Search.prototype.initSearch = function (xmlDocDom) {
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
         //console.log(parsedElementsForIndexing);

         index = evtSearchIndex.createIndex(parsedElementsForIndexing);
         stringifyIndex = JSON.stringify(index);
         stringifyParsedElementsForIndexing = JSON.stringify(parsedElementsForIndexing);
         Utils.compressAndSaveFile(stringifyIndex, indexFileName);
         Utils.compressAndSaveFile(stringifyParsedElementsForIndexing, parsedElementsFileName);
      };

      Search.prototype.getParsedElementsForIndexing = function () {
         return parsedElementsForIndexing;
      };

      Search.prototype.loadParsedElementsForIndexing = function () {
         var serializedElements = window.localStorage.getItem(`${parsedElementsFileName}.txt`);
         parsedElementsForIndexing = JSON.parse(serializedElements);
         return parsedElementsForIndexing;
      };

      Search.prototype.getPrevDocsLines = function () {
         return prevDocsLines;
      };
   }]);
