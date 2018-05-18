angular.module('evtviewer.dataHandler')
   .service('evtSearch', ['evtSearchDocument', 'evtBuilder', 'evtSearchIndex', function Search(evtSearchDocument, evtBuilder, evtSearchIndex) {
      var prevDocsInfo = 0,
         parsedElementsForIndexing = {};
      
      Search.prototype.initSearch = function (xmlDocDom) {
         var parsedElements,
            searchParser = {},
            xmlDocsBody = evtSearchDocument.getXmlDocBody(xmlDocDom);
         
         evtSearchDocument.removeNoteElements(xmlDocDom);
         
         console.time('Parsed all documents');
         for (var i = 0; i < xmlDocsBody.length; i++) {
            console.time('Parsed document number ' + i);
            
            searchParser = evtBuilder.createParser(xmlDocsBody[i]);
            parsedElements = searchParser.parseElements(prevDocsInfo);
            prevDocsInfo = searchParser.getPrevDocsInfo();
            
            parsedElementsForIndexing = angular.extend(parsedElementsForIndexing, parsedElements);
            
            console.timeEnd('Parsed document number ' + i);
            console.log(parsedElements);
         }
         console.timeEnd('Parsed all documents');
         console.log(parsedElementsForIndexing);
         
         console.time('Create Index');
         evtSearchIndex.createIndex(parsedElementsForIndexing);
         console.timeEnd('Create Index');
      };
      
      Search.prototype.getParsedElementsForIndexing = function () {
         return parsedElementsForIndexing;
      };
      
      Search.prototype.getPrevDocsInfo = function () {
         return prevDocsInfo;
      };
   }]);
