angular.module('evtviewer.dataHandler')
   .factory('EvtSearchDiploInterprParLineParser', ['evtSearchDocument', 'evtParagraphHandler', 'XPATH', function (evtSearchDocument, evtParagraphHandler, XPATH) {
      function DiplomaticInterpretativeParLineParser(xmlDocBody) {
         this.parsedElementsForIndexing = {};
         this.xmlDocBody = xmlDocBody;
      }
   
      DiplomaticInterpretativeParLineParser.prototype.getPrevDocsInfo = function () {};
   
      DiplomaticInterpretativeParLineParser.prototype.parseElements = function () {
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
         var parLineNodes;
         
         evtSearchDocument.removeNoteElements(xmlDocDom);
         parLineNodes = getFilteredNodes(xmlDocDom, xmlDocBody, ns, nsResolver);
         return getParLineInfo(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver);
      }
      
      function getFilteredNodes(xmlDocDom, xmlDocBody, ns, nsResolver) {
         return ns ? xmlDocDom.evaluate(XPATH.ns.getParLineNodes, xmlDocBody, nsResolver, XPathResult.ANY_TYPE, null)
            : xmlDocDom.evaluate(XPATH.getParLineNodes, xmlDocBody, null, XPathResult.ANY_TYPE, null);
      }
      
      function getParLineInfo(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver) {
         var currentXmlDoc = evtSearchDocument.getCurrentXmlDoc(xmlDocDom, xmlDocBody, ns, nsResolver),
            currentPage,
            currentPageId,
            pageId = 1,
            documentsToIndex = {},
            
            node = parLineNodes.iterateNext();
         
         while(node !== null) {
            var nodes = {
               'head': function() {
                  console.log();
               },
               'pb': function() {
                  currentPage = evtSearchDocument.getCurrentPage(node);
                  currentPageId = evtSearchDocument.getCurrentPageId(node, pageId);
                  pageId++;
               },
               'p': function () {
                  documentsToIndex = evtParagraphHandler.getParagraphInfo(xmlDocDom, currentXmlDoc, node, currentPage, currentPageId, pageId, documentsToIndex, ns, nsResolver);
               },
               'l': function() {
                  console.log();
               }
            };
            nodes[node.nodeName]();
            node = parLineNodes.iterateNext();
         }
         return documentsToIndex;
      }
      
      return DiplomaticInterpretativeParLineParser;
   }]);
