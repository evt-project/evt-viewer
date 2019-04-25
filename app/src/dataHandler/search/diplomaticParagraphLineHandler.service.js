angular.module('evtviewer.dataHandler')
   .service('evtSearchDiplomaticParLineHandler', ['evtSearchDocument', 'evtDiplomaticEditionHandler', 'evtInterpretativeEditionHandler', 'XPATH', 'Utils',
      function DiplomaticParLineHandler(evtSearchDocument, evtDiplomaticEditionHandler, evtInterpretativeEditionHandler, XPATH, Utils) {
   
         DiplomaticParLineHandler.prototype.getParLineInfo = function (xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver) {
         var currentXmlDoc = evtSearchDocument.getCurrentXmlDoc(xmlDocDom, xmlDocBody, ns, nsResolver),
            editionIsInterp = evtSearchDocument.isAlsoInterpEdition(),
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
               'head': function () {
                  /*var headDiplomaticNodes = evtDiplomaticEditionHandler.getDiplomaticChildNodes(xmlDocDom, node, ns, nsResolver),
                     headInterpretativeNodes = evtInterpretativeEditionHandler.getInterpretativeChildNodes(xmlDocDom, node, ns, nsResolver);
                     
                  var type = {
                     'main': function () {
                        /!*documentToIndex.contentMainTitle = {
                           diplomatic: evtSearchDocument.getContent(headDiplomaticNodes, 'diplomatic'),
                           interpretative: evtSearchDocument.getContent(headInterpretativeNodes, 'interpretative')
                        };*!/
                        mainTitle = evtSearchDocument.getContent(headInterpretativeNodes, 'interpretative');
                     },
                     'default': function () {
                        /!*documentToIndex.contentSectionTitle = {
                           diplomatic: evtSearchDocument.getContent(headDiplomaticNodes, 'diplomatic'),
                           interpretative: evtSearchDocument.getContent(headInterpretativeNodes, 'interpretative')
                        };*!/
                        sectionTitle = evtSearchDocument.getContent(headInterpretativeNodes, 'interpretative');
                        sectionTitle = Utils.cleanText(sectionTitle);
                     }
                  };
                  (type[node.getAttribute('type') === 'main'] || type['default'])();
                  lineId = 1;*/
               },
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
      
                  /*for(var i = 0; i < diplomaticNodes.length;) {
                     var currentElDiplomaticNodes,
                        currentElInterpretativeNodes,
                        cleanedCurrentElementDiplomaticNodes,
                        cleanedCurrentElementInterpretativeNodes;
                     
                     if(diplomaticNodes[i].nodeName === 'pb') {
                        currentPage = evtSearchDocument.getCurrentPage(diplomaticNodes[i]);
                        currentPageId = evtSearchDocument.getCurrentPageId(diplomaticNodes[i], pageId);
                        pageId++;
                        diplomaticNodes.splice(0, 1);
                        interpretativeNodes.splice(0, 1);
                     }
                     
                     /!*if(mainTitle !== undefined) {
                        documentToIndex.mainTitle = mainTitle;
                     }
                     if(sectionTitle !== undefined) {
                        documentToIndex.sectionTitle = sectionTitle;
                     }*!/
                     
                     documentToIndex.xmlDocTitle = currentXmlDoc.title;
                     documentToIndex.xmlDocId = currentXmlDoc.id;
                     
                     
                     
                     var nodeName = {
                        'p': function() {
                           paragraph = evtSearchDocument.getParagraph(node, parId);
                           documentToIndex.paragraph = paragraph;
                           documentToIndex.docId = currentPage ? documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.paragraph
                                                               : documentToIndex.xmlDocId + '-' + documentToIndex.paragraph;
                           parId++;
                        },
                        'l': function() {
                           line = evtSearchDocument.getLine(node, lineId);
                           documentToIndex.line = line;
                           documentToIndex.docId = currentPage ? documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.line
                                                               : documentToIndex.xmlDocId + '-' + documentToIndex.line;
                           lineId++;
                        }
                     };
                     nodeName[node.nodeName]();
   
                     currentElDiplomaticNodes = evtSearchDocument.getCurrentPageNodes(xmlDocDom, diplomaticNodes);
                     currentElInterpretativeNodes = evtSearchDocument.getCurrentPageNodes(xmlDocDom, interpretativeNodes);
                     cleanedCurrentElementDiplomaticNodes = evtSearchDocument.removeEmptyTextNodes(currentElDiplomaticNodes);
                     cleanedCurrentElementInterpretativeNodes = evtSearchDocument.removeEmptyTextNodes(currentElInterpretativeNodes);
                     
                     if(cleanedCurrentElementDiplomaticNodes.length === 0 && cleanedCurrentElementInterpretativeNodes.length === 0) {
                        documentToIndex = {};
                        continue;
                     }
   
                     documentToIndex.content = {
                        diplomatic: evtSearchDocument.getContent(currentElDiplomaticNodes, 'diplomatic'),
                        interpretative: evtSearchDocument.getContent(currentElInterpretativeNodes, 'interpretative')
                     };
                     
                     documentsToIndex[documentToIndex.docId] = documentToIndex;
                     currentElDiplomaticNodes = [];
                     currentElInterpretativeNodes = [];
                     documentToIndex = {};
                  }*/
               }
            };
            (nodes[node.nodeName] || nodes['default'])();
            node = parLineNodes.iterateNext();
         }
         return documentsToIndex;
      };
      
   }]);
