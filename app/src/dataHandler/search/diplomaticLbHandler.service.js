angular.module('evtviewer.dataHandler')
   .service('evtSearchDiplomaticLbHandler', ['evtSearchDocument', function DiplomaticLbHandler(evtSearchDocument) {
      var countAllDocsLine = 0;
      
      DiplomaticLbHandler.prototype.getLineInfo = function(xmlDocDom, xmlDocBody, lbNodes, prevDocsLbNumber, ns, nsResolver) {
         var currentXmlDoc = evtSearchDocument.getCurrentXmlDoc(xmlDocDom, xmlDocBody, ns, nsResolver),
            bodyTextGlyphNodes = evtSearchDocument.getBodyTextGlyphNodes(xmlDocDom, xmlDocBody, ns, nsResolver),
            currentPage,
            currentPageId,
            pageId = 1,
            paragraph,
            parId = 1,
            line = {},
            lineId,
            currentLineNodes = {},
            lines = {},
            countLine = 1,
            
            node = lbNodes.iterateNext();
         
         while(node !== null) {
            var nodes = {
               'head': function () {
                  console.log();
               },
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
               'default' : function () {
                  if (currentPage) {
                     line.page = currentPage;
                     line.pageId = currentPageId;
                  }
                  if (paragraph) {
                     line.paragraph = paragraph;
                  }
                  line.xmlDocTitle = currentXmlDoc.title;
                  line.xmlDocId = currentXmlDoc.id;
                  line.line = node.getAttribute('n') || lineId.toString();
                  lineId++;
                  line.docId = line.xmlDocId + '-' + line.pageId + '-' + line.line;
   
                  currentLineNodes = evtSearchDocument.getLineNodes(xmlDocDom, bodyTextGlyphNodes, prevDocsLbNumber, countLine, ns, nsResolver)
                  
                  line.content = evtSearchDocument.getContent(currentLineNodes, '');
                  
                  countLine++;
                  countAllDocsLine++;
                  lines[line.docId] = line;
                  currentLineNodes = [];
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
