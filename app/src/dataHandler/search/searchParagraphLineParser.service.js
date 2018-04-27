angular.module('evtviewer.dataHandler')
   .factory('EvtSearchParLineParser', ['evtSearchDocument', 'XPATH', function (evtSearchDocument, XPATH) {
      function ParLineParser(xmlDocBody) {
         this.parsedElementsForIndexing = {};
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
         
         this.parsedElementsForIndexing = getParLineElements(xmlDocDom, this.xmlDocBody, ns, nsResolver);
         return this.parsedElementsForIndexing;
      };
      
      function getParLineElements(xmlDocDom, xmlDocBody, ns, nsResolver) {
         var parsedElementsForIndexing = [],
            parLineNodes;
         
         evtSearchDocument.removeNoteElements(xmlDocDom);
         parLineNodes = getFilteredNodes(xmlDocDom, xmlDocBody, ns, nsResolver);
         parsedElementsForIndexing = getParLineInfo(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver);
      }
      
      function getFilteredNodes(xmlDocDom, xmlDocBody, ns, nsResolver) {
         return ns ? xmlDocDom.evaluate(XPATH.ns.getParLineNodes, xmlDocBody, nsResolver, XPathResult.ANY_TYPE, null)
            : xmlDocDom.evaluate(XPATH.getParLineNodes, xmlDocBody, null, XPathResult.ANY_TYPE, null);
      }
      
      function getParLineInfo(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver) {
         var currentXmlDoc = evtSearchDocument.getCurrentXmlDoc(xmlDocDom, xmlDocBody, ns, nsResolver),
            node = parLineNodes.iterateNext();
         
         while(node !== null) {
            var nodes = {
            };
            (nodes[node.nodeName] || nodes['default'])();
         }
      }
      
      return ParLineParser;
   }]);
