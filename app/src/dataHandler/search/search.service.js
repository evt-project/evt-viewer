angular.module('evtviewer.dataHandler')
   .service('evtSearch', ['evtSearchDocument', 'evtBuilder', 'evtSearchIndex', function Search(evtSearchDocument, evtBuilder, evtSearchIndex) {
      var prevDocsLines = 0,
         parsedElementsForIndexing = {};
      
      Search.prototype.initSearch = function (xmlDocDom) {
         console.time('PARSING TIME');
         
         var parsedElements,
            searchParser = {},
            xmlDocsBody = evtSearchDocument.getXmlDocBody(xmlDocDom);
         
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
         
         var index = evtSearchIndex.createIndex(parsedElementsForIndexing);
         console.log(index);
      };
      
      Search.prototype.getParsedElementsForIndexing = function () {
         return parsedElementsForIndexing;
      };
      
      Search.prototype.getPrevDocsLines = function () {
         return prevDocsLines;
      };
   }]);
