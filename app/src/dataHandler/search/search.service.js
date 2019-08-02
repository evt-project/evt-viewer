angular.module('evtviewer.dataHandler')
   .service('evtSearch', ['evtSearchDocument', 'evtBuilder', 'evtSearchIndex', function Search(evtSearchDocument, evtBuilder, evtSearchIndex) {
      var prevDocsLines = 0,
         parsedElementsForIndexing = {};
      
      Search.prototype.initSearch = function (xmlDocDom) {
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
         //console.log(parsedElementsForIndexing);

         evtSearchIndex.createIndex(parsedElementsForIndexing);
      };
      
      Search.prototype.getParsedElementsForIndexing = function () {
         return parsedElementsForIndexing;
      };
      
      Search.prototype.getPrevDocsLines = function () {
         return prevDocsLines;
      };
   }]);
