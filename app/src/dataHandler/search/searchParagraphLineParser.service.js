angular.module('evtviewer.dataHandler')
   .factory('EvtSearchParLineParser', ['evtSearchDocument', function (evtSearchDocument) {
      function ParLineParser(xmlDocBody) {
         this.parsedElementsForIndexing = {};
         this.xmlDocsTitles = evtSearchDocument.getXmlDocumentsTitles();
         this.xmlDocBody = xmlDocBody;
      }
      
      ParLineParser.prototype.getPrevDocsInfo = function () {
      };
      
      ParLineParser.prototype.parseElements = function () {
         var ns,
            nsResolver,
            xmlDocDom = this.xmlDocBody.ownerDocument;
         
         evtSearchDocument.hasNamespace(xmlDocDom);
         ns = evtSearchDocument.ns;
         nsResolver = evtSearchDocument.nsResolver;
         
         this.parsedElementsForIndexing = getParLineElements(xmlDocDom);
         return this.parsedElementsForIndexing;
      };
      
      function getParLineElements(xmlDocDom) {
         evtSearchDocument.removeNoteElements(xmlDocDom);
      }
      
      return ParLineParser;
   }]);
