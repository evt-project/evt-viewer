angular.module('evtviewer.dataHandler')
   .service('evtSearchDiploInterprLbHandler', ['evtSearchDocument', 'evtDiplomaticEditionHandler', 'evtInterpretativeEditionHandler',
      function DiploInterprLbHandler(evtSearchDocument, evtDiplomaticEditionHandler, evtInterpretativeEditionHandler){
   
         var countAllDocsLine = 0;
         DiploInterprLbHandler.prototype.getLineInfo = function(xmlDocDom, xmlDocBody, lbNodes, prevDocsLbNumber, ns, nsResolver) {
            var currentXmlDoc = evtSearchDocument.getCurrentXmlDoc(xmlDocDom, xmlDocBody, ns, nsResolver),
               diplomaticNodes = evtDiplomaticEditionHandler.getDiplomaticNodes(xmlDocDom, xmlDocBody, ns, nsResolver),
               interpretativeNodes = evtInterpretativeEditionHandler.getInterpretativeNodes(xmlDocDom, xmlDocBody, ns, nsResolver),
               currentPage,
               currentPageId,
               pageId = 1,
               paragraph,
               parId = 1,
               line = {},
               lineId = 1,
               lineNodes = {},
               lines = {},
               countLine = 1,
               node = lbNodes.iterateNext();
      
            while (node !== null) {
               var nodes = {
                  'pb': function () {
                     currentPage = evtSearchDocument.getCurrentPage(node);
                     currentPageId = evtSearchDocument.getCurrentPageId(node, pageId);
                     pageId++;
                     lineId = 0;
                  },
                  'p': function () {
                     paragraph = evtSearchDocument.getParagraph(node, parId);
                     parId++;
                  },
                  'default': function () {
                     if (currentPage) {
                        line.page = currentPage;
                        line.pageId = currentPageId;
                     }
                     if (paragraph) {
                        line.par = paragraph;
                     }
                     line.xmlDocTitle = currentXmlDoc.title;
                     line.xmlDocId = currentXmlDoc.id;
                     line.line = node.getAttribute('n') || lineId.toString();
                     lineId++;
                     line.docId = line.xmlDocId + '-' + line.pageId + '-' + line.line;
               
                     lineNodes.diplomatic = evtSearchDocument.getLineNodes(xmlDocDom, diplomaticNodes, prevDocsLbNumber, countLine, ns, nsResolver);
                     lineNodes.interpretative = evtSearchDocument.getLineNodes(xmlDocDom, interpretativeNodes, prevDocsLbNumber, countLine, ns, nsResolver);
                     countLine++;
                     countAllDocsLine++;
               
                     line.content = {
                        diplomatic: evtSearchDocument.getContent(lineNodes.diplomatic, 'diplomatic'),
                        interpretative: evtSearchDocument.getContent(lineNodes.interpretative, 'interpretative')
                  
                     };
                     lines[line.docId] = line;
                     lineNodes = [];
                  }
               };
               (nodes[node.nodeName] || nodes['default'])();
               node = lbNodes.iterateNext();
               line = {};
            }
            lines.countAllLines = countAllDocsLine;
            return lines;
         };
   }]);
