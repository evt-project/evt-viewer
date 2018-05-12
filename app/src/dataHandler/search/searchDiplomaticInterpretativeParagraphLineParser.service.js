angular.module('evtviewer.dataHandler')
   .factory('EvtSearchDiploInterprParLineParser', ['evtSearchDocument', 'evtDiplomaticEditionHandler', 'evtInterpretativeEditionHandler', 'XPATH', function (evtSearchDocument, evtDiplomaticEditionHandler, evtInterpretativeEditionHandler, XPATH) {
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
            paragraph,
            parId = 1,
            line,
            lineId = 1,
            documentToIndex = {},
            documentsToIndex = {},
            
            node = parLineNodes.iterateNext();
         
         while(node !== null) {
            var nodes = {
               'head': function() {
                  console.log();
               },
               'pb': function() {
                  currentPage = evtSearchDocument.getCurrentPage(node);
                  currentPageId = evtSearchDocument.getCurrentPageId(node);
                  pageId++;
               },
               'default': function () {
                  var diplomaticNodes = evtDiplomaticEditionHandler.getDiplomaticChildNodes(xmlDocDom, node, ns, nsResolver),
                     interpretativeNodes = evtInterpretativeEditionHandler.getInterpretativeChildNodes(xmlDocDom, node, ns, nsResolver);
                  
                  for(var i = 0; i < diplomaticNodes.length;) {
                     var currentElementDiplomaticNodes,
                        currentElementInterpretativeNodes;
                     
                     if(diplomaticNodes[i].nodeName === 'pb') {
                        currentPage = evtSearchDocument.getCurrentPage(diplomaticNodes[i]);
                        currentPageId = evtSearchDocument.getCurrentPageId(diplomaticNodes[i], pageId);
                        pageId++;
                        diplomaticNodes.splice(0, 1);
                        interpretativeNodes.splice(0, 1);
                     }
   
                     documentToIndex.xmlDocTitle = currentXmlDoc.title;
                     documentToIndex.xmlDocId = currentXmlDoc.id;
                     documentToIndex.page = currentPage;
                     documentToIndex.pageId = currentPageId;
   
                     var nodeName = {
                        'p': function() {
                           paragraph = node.getAttribute('n') || parId.toString();
                           documentToIndex.paragraph = paragraph;
                           documentToIndex.docId = documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.paragraph;
                           parId++;
                        },
                        'l': function() {
                           line = node.getAttribute('n') || lineId.toString();
                           documentToIndex.line = line;
                           documentToIndex.docId = documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.line;
                           lineId++;
                        }
                     };
                     nodeName[node.nodeName]();
   
                     currentElementDiplomaticNodes = evtSearchDocument.getCurrentPageParNodes(xmlDocDom, diplomaticNodes);
                     currentElementInterpretativeNodes = evtSearchDocument.getCurrentPageParNodes(xmlDocDom, interpretativeNodes);
   
                     documentToIndex.content = {
                        diplomatic: evtSearchDocument.getContent(currentElementDiplomaticNodes, 'diplomatic'),
                        interpretative: evtSearchDocument.getContent(currentElementInterpretativeNodes, 'interpretative')
                     };
                     
                     documentsToIndex[documentToIndex.docId] = documentToIndex;
                     currentElementDiplomaticNodes = [];
                     currentElementInterpretativeNodes = [];
                     documentToIndex = {};
                  }
               }
            };
            (nodes[node.nodeName] || nodes['default'])();
            node = parLineNodes.iterateNext();
         }
         return documentsToIndex;
      }
      
      return DiplomaticInterpretativeParLineParser;
   }]);
