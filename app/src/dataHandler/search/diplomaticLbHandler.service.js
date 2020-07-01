angular.module('evtviewer.dataHandler')
   .service('evtSearchDiplomaticLbHandler', ['evtSearchDocument', 'evtDiplomaticEditionHandler', 'evtInterpretativeEditionHandler',
      function DiplomaticLbHandler(evtSearchDocument, evtDiplomaticEditionHandler, evtInterpretativeEditionHandler){
         
         var countAllDocsLine = 0;
         DiplomaticLbHandler.prototype.getLineInfo = function(xmlDocDom, xmlDocBody, lbNodes, prevDocsLbNumber, ns, nsResolver) {
            var currentXmlDoc = evtSearchDocument.getCurrentXmlDoc(xmlDocDom, xmlDocBody, ns, nsResolver),
               diplomaticNodes = evtDiplomaticEditionHandler.getDiplomaticNodes(xmlDocDom, xmlDocBody, ns, nsResolver),
               editionIsInterp = evtSearchDocument.isInterpEdition(),
               editionIsDipl = evtSearchDocument.isDiplEdition(),
               cleanedDiplomaticNodes = [],
               cleanedInterpretativeNodes = [],
               currentPage,
               currentPageId,
               pageId = 1,
               paragraph,
               parId = 1,
               line = {},
               lineId = 1,
               prevLine = 0,
               lineNodes = {},
               lines = {},
               countLine = 1,
               countDuplicateLines = 0,
               node = lbNodes.iterateNext();
            var interpretativeNodes = [];
            if (editionIsInterp) {
               interpretativeNodes = evtInterpretativeEditionHandler.getInterpretativeNodes(xmlDocDom, xmlDocBody, ns, nsResolver);
            }
            
            while (node !== null) {
               var nodes = {
                  'pb': function () {
                     currentPage = evtSearchDocument.getCurrentPage(node) || pageId;
                     currentPageId = evtSearchDocument.getCurrentPageId(node, pageId);
                     pageId++;
                     lineId = 0;
                  },
                  'p': function () {
                     paragraph = evtSearchDocument.getParagraph(node, parId);
                     parId++;
                  },
                  'default': function () {
                     line.line = node.getAttribute('n') || lineId.toString();
                     /* to handle <lb> elements inside <choice> element => in the xml coding in this case there will
                     be two <lb> with the same "n" attribute */
                     if(prevLine !== line.line) {
                        if (currentPage) {
                           line.page = currentPage;
                           line.pageId = currentPageId;
                        }
                        if (paragraph) {
                           line.paragraph = paragraph;
                        }
                        line.xmlDocTitle = currentXmlDoc.title;
                        line.xmlDocId = currentXmlDoc.id;
                        line.docId = line.xmlDocId + '-' + line.pageId + '-' + line.line;
                        line.lbId = node.getAttribute('xml:id');
                        
                        do {
                           if (editionIsDipl) {
                              lineNodes.diplomatic = evtSearchDocument.getLineNodes(xmlDocDom, diplomaticNodes, prevDocsLbNumber, countLine, ns, nsResolver);
                              cleanedDiplomaticNodes = evtSearchDocument.removeEmptyTextNodes(lineNodes.diplomatic);
                           } else {
                              lineNodes.diplomatic = [];
                              cleanedDiplomaticNodes = [];
                           }
                           
                           if (editionIsInterp) {
                              lineNodes.interpretative = evtSearchDocument.getLineNodes(xmlDocDom, interpretativeNodes, prevDocsLbNumber, countLine, ns, nsResolver);
                              cleanedInterpretativeNodes = evtSearchDocument.removeEmptyTextNodes(lineNodes.interpretative);
                           } else {
                              lineNodes.interpretative = [];
                              cleanedInterpretativeNodes = [];
                           }
                        } while (cleanedDiplomaticNodes.length === 0 && cleanedInterpretativeNodes.length === 0 &&
                           lineNodes.diplomatic.length !== 0 && lineNodes.interpretative.length !== 0);
                        
                        line.content = {};
                        if (editionIsDipl) {
                           line.content.diplomatic = evtSearchDocument.getContent(lineNodes.diplomatic, 'diplomatic');
                        }
                        
                        if (editionIsInterp) {
                           line.content.interpretative = evtSearchDocument.getContent(lineNodes.interpretative, 'interpretative');
                        }
                        
                        lineId++;
                        countLine++;
                        countAllDocsLine++;
                        prevLine = line.line;
                        
                        lines[line.docId] = line;
                        lineNodes = [];
                     }
                     else {
                        countDuplicateLines++;
                     }
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
