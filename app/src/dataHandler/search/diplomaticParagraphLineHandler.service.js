angular.module('evtviewer.dataHandler')
   .service('evtSearchDiplomaticParLineHandler', ['evtSearchDocument', 'evtDiplomaticEditionHandler', 'evtInterpretativeEditionHandler', 'XPATH', 'Utils',
      function DiplomaticParLineHandler(evtSearchDocument, evtDiplomaticEditionHandler, evtInterpretativeEditionHandler, XPATH, Utils) {
         
         DiplomaticParLineHandler.prototype.getParLineInfo = function (xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver) {
            var currentXmlDoc = evtSearchDocument.getCurrentXmlDoc(xmlDocDom, xmlDocBody, ns, nsResolver),
               editionIsInterp = evtSearchDocument.isAlsoInterpEdition(),
               currentPage,
               currentPageId,
               pageId = 1,
               parId = 1,
               lineId = 1,
               documentToIndex = {},
               documentsToIndex = {},
               
               node = parLineNodes.iterateNext();
            
            while(node !== null) {
               var nodes = {
                  'head': function () {},
                  'pb': function () {
                     currentPage = evtSearchDocument.getCurrentPage(node) || pageId;
                     currentPageId = evtSearchDocument.getCurrentPageId(node, pageId);
                     pageId++;
                  },
                  'default': function () {
                     var diplomaticNodes = evtDiplomaticEditionHandler.getDiplomaticChildNodes(xmlDocDom, node, ns, nsResolver);
                     
                     if (editionIsInterp) {
                        var interpretativeNodes = evtInterpretativeEditionHandler.getInterpretativeChildNodes(xmlDocDom, node, ns, nsResolver);
                     }
                     
                     diplomaticNodes.forEach(function (childNode) {
                        var childDiplNodes,
                           cleanedChildDiplNodes;
                        
                        if (childNode.nodeName === 'pb') {
                           currentPage = evtSearchDocument.getCurrentPage(childNode);
                           currentPageId = evtSearchDocument.getCurrentPageId(childNode, pageId);
                           pageId++;
                           diplomaticNodes.splice(0, 1);
                           if (editionIsInterp) {
                              interpretativeNodes.splice(0, 1);
                           }
                        }
                        
                        if (currentPage) {
                           documentToIndex.page = currentPage;
                           documentToIndex.pageId = currentPageId;
                        }
                        
                        documentToIndex.xmlDocTitle = currentXmlDoc.title;
                        documentToIndex.xmlDocId = currentXmlDoc.id;
                        
                        var nodeName = {
                           'p': function () {
                              documentToIndex.paragraph = evtSearchDocument.getParagraph(node, parId);
                              documentToIndex.docId = documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.paragraph;
                              parId++;
                           },
                           'l': function () {
                              documentToIndex.line = evtSearchDocument.getLine(node, lineId);
                              documentToIndex.docId = documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.line;
                              lineId++;
                           }
                        };
                        nodeName[node.nodeName]();
                        
                        documentToIndex.content = {};
                        
                        childDiplNodes = evtSearchDocument.getCurrentPageNodes(xmlDocDom, diplomaticNodes);
                        cleanedChildDiplNodes = evtSearchDocument.removeEmptyTextNodes(childDiplNodes);
                        if (cleanedChildDiplNodes.length === 0) {
                           documentToIndex = {};
                           return;
                        }
                        documentToIndex.content.diplomatic = evtSearchDocument.getContent(cleanedChildDiplNodes, 'diplomatic');
                        
                        if (editionIsInterp) {
                           var childInterpNodes = evtSearchDocument.getCurrentPageNodes(xmlDocDom, interpretativeNodes),
                              cleanedChildInterpNodes = evtSearchDocument.removeEmptyTextNodes(childInterpNodes);
                           if (cleanedChildInterpNodes.length === 0) {
                              documentToIndex = {};
                              return;
                           }
                           documentToIndex.content.interpretative = evtSearchDocument.getContent(cleanedChildInterpNodes, 'interpretative');
                        }
                        documentsToIndex[documentToIndex.docId] = documentToIndex;
                        documentToIndex = {};
                        childDiplNodes = [];
                        if (editionIsInterp) {
                           childInterpNodes = [];
                        }
                     });
                  }
               };
               (nodes[node.nodeName] || nodes['default'])();
               node = parLineNodes.iterateNext();
            }
            return documentsToIndex;
         };
         
      }]);
