angular.module('evtviewer.dataHandler')
   .service('EvtSearchDiplomaticParLineHandler', ['evtSearchDocument', 'XPATH', function DiplomaticParLineHandler(evtSearchDocument, XPATH) {
      
      DiplomaticParLineHandler.prototype.getParLineInfo = function(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver) {
         var currentXmlDoc = evtSearchDocument.getCurrentXmlDoc(xmlDocDom, xmlDocBody, ns, nsResolver),
            currentPage,
            currentPageId,
            pageId = 1,
            paragraph,
            parId = 1,
            line,
            lineId,
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
               'default': function () {
                  var childNodes = getChildNodes(xmlDocDom, node, ns, nsResolver),
                     currentNode = childNodes.iterateNext(),
                     nodes = [];
                  
                  while(currentNode !== null) {
                     nodes.push(currentNode);
                     currentNode = childNodes.iterateNext();
                  }
                  
                  for(var i = 0; i < nodes.length;) {
                     var currentElementNodes;
                     
                     if(nodes[i].nodeName === 'pb') {
                        currentPage = evtSearchDocument.getCurrentPage(nodes[i]);
                        currentPageId = evtSearchDocument.getCurrentPageId(nodes[i], pageId);
                        pageId++;
                        nodes.splice(nodes.indexOf(nodes[i]), 1);
                     }
      
                     documentToIndex.xmlDocTitle = currentXmlDoc.title;
                     documentToIndex.xmlDocId = currentXmlDoc.id;
                     
                     if(currentPage) {
                        documentToIndex.page = currentPage;
                        documentToIndex.pageId = currentPageId;
                     }
                     
                     var nodeName = {
                        'p': function() {
                           paragraph = evtSearchDocument.getParagraph(node, parId);
                           documentToIndex.paragraph = paragraph;
                           documentToIndex.docId = currentPage ? documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.paragraph
                                                               : documentToIndex.xmlDocId + '-' + documentToIndex.paragraph;
                        },
                        'l': function() {
                           line = evtSearchDocument.getLine(node, lineId);
                           documentToIndex.line = line;
                           documentToIndex.docId = currentPage ? documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.line
                                                               : documentToIndex.xmlDocId + '-' + documentToIndex.line;
                        }
                     };
                     nodeName[node.nodeName]();
                     
                     currentElementNodes = evtSearchDocument.getCurrentPageNodes(xmlDocDom, nodes);
                     documentToIndex.content = evtSearchDocument.getContent(currentElementNodes, '');
   
                     documentsToIndex[documentToIndex.docId] = documentToIndex;
                     currentElementNodes = [];
                     documentToIndex = {};
                  }
                  parId++;
               }
            };
            (nodes[node.nodeName] || nodes['default'])();
            node = parLineNodes.iterateNext();
         }
         return documentsToIndex;
      };
      
      function getChildNodes(xmlDocDom, node, ns, nsResolver) {
         return ns ? xmlDocDom.evaluate(XPATH.ns.getChildNodes, node, nsResolver, XPathResult.ANY_TYPE, null)
                   : xmlDocDom.evaluate(XPATH.getChildNodes, node, null, XPathResult.ANY_TYPE, null);
      }
      
   }]);
