angular.module('evtviewer.dataHandler')
   .factory('EvtParagraphLineParser',['evtSearchDocument', 'evtSearchDiplomaticParLineHandler', 'evtSearchDiploInterprParLineHandler', 'XPATH',
      function ParagraphLineParser(evtSearchDocument, evtSearchDiplomaticParLineHandler, evtSearchDiploInterprParLineHandler, XPATH) {
      
      function ParagraphLineParser(xmlDocBody) {
         this.parsedElementsForIndexing = {};
         this.xmlDocBody = xmlDocBody;
      }
   
      ParagraphLineParser.prototype.getPrevDocsLines = function () {};
      
      ParagraphLineParser.prototype.parseElements = function() {
         var ns,
            nsResolver,
            xmlDocDom = this.xmlDocBody.ownerDocument;
   
         evtSearchDocument.hasNamespace(xmlDocDom);
         ns = evtSearchDocument.ns;
         nsResolver = evtSearchDocument.nsResolver;
   
         this.parsedElementsForIndexing = getParLineElements(xmlDocDom, this.xmlDocBody, ns, nsResolver);
         return this.parsedElementsForIndexing;
      };
   
      function getParLineElements(xmlDocDom, xmlDocBody, ns, nsResolver) {
         var parLineNodes = getFilteredNodes(xmlDocDom, xmlDocBody, ns, nsResolver);
         return getParLineInfo(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver);
      }
   
      function getFilteredNodes(xmlDocDom, xmlDocBody, ns, nsResolver) {
         return ns ? xmlDocDom.evaluate(XPATH.ns.getParLineNodes, xmlDocBody, nsResolver, XPathResult.ANY_TYPE, null)
            : xmlDocDom.evaluate(XPATH.getParLineNodes, xmlDocBody, null, XPathResult.ANY_TYPE, null);
      }
      
      function getParLineInfo (xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver) {
         return evtSearchDocument.isOnlyDiplomaticEdition(xmlDocBody) ? evtSearchDiplomaticParLineHandler.getParLineInfo(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver)
                                                                  : evtSearchDiploInterprParLineHandler.getParLineInfo(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver);
      }
      
      return ParagraphLineParser;
   }]);
