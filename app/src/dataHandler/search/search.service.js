angular.module('evtviewer.dataHandler')
   .service('evtSearch', ['evtSearchDocument', 'evtBuilder', 'evtSearchIndex', function Search(evtSearchDocument, evtBuilder, evtSearchIndex) {
      var prevDocsInfo = 0,
         parsedElementsForIndexing = {};
      
      Search.prototype.initSearch = function (xmlDocDom) {
         var parsedElements,
            searchParser = {},
            xmlDocsBody = evtSearchDocument.getXmlDocBody(xmlDocDom);
         
         evtSearchDocument.removeNoteElements(xmlDocDom);
         
         for (var i = 0; i < xmlDocsBody.length; i++) {
            searchParser = evtBuilder.createParser(xmlDocsBody[i]);
            parsedElements = searchParser.parseElements(prevDocsInfo);
            prevDocsInfo = searchParser.getPrevDocsInfo();
            parsedElementsForIndexing = angular.extend(parsedElementsForIndexing, parsedElements);
         }
         console.log(JSON.stringify(parsedElementsForIndexing));
         
         evtSearchIndex.createIndex(parsedElementsForIndexing);
      };
      
      Search.prototype.getParsedElementsForIndexing = function () {
        // var elements = BUILTINDEX.elements ? JSON.parse(BUILTINDEX.elements) : {};
        // if (Object.keys(elements).length > 0) {
        //   parsedElementsForIndexing = elements;
        // }
        return parsedElementsForIndexing;
      };
      
      Search.prototype.getPrevDocsInfo = function () {
         return prevDocsInfo;
      };
   }]);
