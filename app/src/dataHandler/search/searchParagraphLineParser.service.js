angular.module('evtviewer.dataHandler')
   .factory('EvtSearchParLineParser', ['evtSearchDocument', 'evtDiplomaticEditionHandler', 'evtInterpretativeEditionHandler', 'XPATH', function (evtSearchDocument, evtDiplomaticEditionHandler, evtInterpretativeEditionHandler, XPATH) {
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
            countPage = 1,
            paragraph,
            parId = 1,
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
                  currentPageId = evtSearchDocument.getCurrentPageId(node, pageId);
                  pageId++;
               },
               'p': function () {
                  var diplomaticNodes = evtDiplomaticEditionHandler.getParagraphDiplomaticNodes(xmlDocDom, node, ns, nsResolver),
                     interpretativeNodes = evtInterpretativeEditionHandler.getParagraphInterpretativeNodes(xmlDocDom, node, ns, nsResolver);
                  
                  for(var i = 0; i < diplomaticNodes.length;) {
                     var currentPageDiplomaticNodes,
                        currentPageInterpretativeNodes;
                     
                     if(diplomaticNodes[i].nodeName === 'pb') {
                        currentPage = evtSearchDocument.getCurrentPage(diplomaticNodes[i]);
                        currentPageId = evtSearchDocument.getCurrentPageId(diplomaticNodes[i], pageId);
                        pageId++;
                        diplomaticNodes.splice(0, 1);
                        interpretativeNodes.splice(0, 1);
                     }
                     paragraph = evtSearchDocument.getParagraph(node, parId);
   
                     documentToIndex.xmlDocTitle = currentXmlDoc.title;
                     documentToIndex.xmlDocId = currentXmlDoc.id;
                     documentToIndex.paragraph = paragraph;
                     documentToIndex.page = currentPage;
                     documentToIndex.pageId = currentPageId;
                     documentToIndex.docId = documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.paragraph;
   
                     currentPageDiplomaticNodes = getCurrentPageNodes(xmlDocDom, diplomaticNodes);
                     currentPageInterpretativeNodes = getCurrentPageNodes(xmlDocDom, interpretativeNodes);
   
                     documentToIndex.content = {
                        diplomatic: evtSearchDocument.getContent(currentPageDiplomaticNodes, 'diplomatic'),
                        interpretative: evtSearchDocument.getContent(currentPageInterpretativeNodes, 'interpretative')
                     };
                     
                     documentsToIndex[documentToIndex.docId] = documentToIndex;
                     currentPageDiplomaticNodes = [];
                     currentPageInterpretativeNodes = [];
                     documentToIndex = {};
                  }
                  parId++;
               },
               'l': function() {
                  console.log();
               }
            };
            nodes[node.nodeName]();
            node = parLineNodes.iterateNext();
            //documentToIndex = {};
         }
         return documentsToIndex;
      }
      
      function getCurrentPageNodes(xmlDocDom, nodes) {
         var currentPageNodes = [],
            prevPb;
         
         for(var i = 0; i < nodes.length;) {
            if(nodes[i].nodeName !== 'pb') {
               currentPageNodes.push(nodes[i]);
               nodes.splice(0, 1);
            }
            else {
               return currentPageNodes;
            }
         }
         return currentPageNodes;
      }
      
      return ParLineParser;
   }]);
