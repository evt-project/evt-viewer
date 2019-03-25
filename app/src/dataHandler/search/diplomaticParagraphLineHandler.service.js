angular.module('evtviewer.dataHandler')
   .service('evtSearchDiplomaticParLineHandler', ['evtSearchDocument', 'XPATH', function DiplomaticParLineHandler(evtSearchDocument, XPATH) {
      
      DiplomaticParLineHandler.prototype.getParLineInfo = function(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver) {
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
                  currentPageId = evtSearchDocument.getCurrentPageId(node, pageId);
                  pageId++;
               },
               'default': function () {
                  var childNodes = evtSearchDocument.getChildNodes(xmlDocDom, node, ns, nsResolver);
                  
                  for(var i = 0; i < childNodes.length;) {
                     var currentElementNodes;
                     
                     if(childNodes[i].nodeName === 'pb') {
                        currentPage = evtSearchDocument.getCurrentPage(childNodes[i]);
                        currentPageId = evtSearchDocument.getCurrentPageId(childNodes[i], pageId);
                        pageId++;
                        childNodes.splice(childNodes.indexOf(childNodes[i]), 1);
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
                     
                     currentElementNodes = evtSearchDocument.getCurrentPageNodes(xmlDocDom, childNodes);
                     documentToIndex.content = evtSearchDocument.getContent(currentElementNodes, '');
   
                     documentsToIndex[documentToIndex.docId] = documentToIndex;
                     currentElementNodes = [];
                     documentToIndex = {};
                  }
                  //parId++;
               }
            };
            (nodes[node.nodeName] || nodes['default'])();
            node = parLineNodes.iterateNext();
         }
         return documentsToIndex;
      };
      
   }]);
