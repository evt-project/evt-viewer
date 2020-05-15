angular.module('evtviewer.dataHandler')
   .service('evtSearchFacsimileLbHandler', ['evtSearchDocument', 'evtFacsimileEditionHandler', 'evtInterpretativeEditionHandler',
      function FacsimileLbHandler(evtSearchDocument, evtFacsimileEditionHandler, evtInterpretativeEditionHandler){

         var countAllDocsLine = 0;
         FacsimileLbHandler.prototype.getLineInfo = function(xmlDocDom, xmlDocBody, lbNodes, prevDocsLbNumber, ns, nsResolver) {
            var currentXmlDoc = evtSearchDocument.getCurrentXmlDoc(xmlDocDom, xmlDocBody, ns, nsResolver),
               facsimileNodes = evtFacsimileEditionHandler.getFacsimileNodes(xmlDocDom, xmlDocBody, ns, nsResolver),
               editionIsInterp = evtSearchDocument.isAlsoInterpEdition(),
               cleanedFacsimileNodes = [],
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

            if(editionIsInterp) {
               var interpretativeNodes = evtInterpretativeEditionHandler.getInterpretativeNodes(xmlDocDom, xmlDocBody, ns, nsResolver);
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
                           lineNodes.facsimile = evtSearchDocument.getLineNodes(xmlDocDom, facsimileNodes, prevDocsLbNumber, countLine, ns, nsResolver);
                           cleanedFacsimileNodes = evtSearchDocument.removeEmptyTextNodes(lineNodes.facsimile);

                           if(editionIsInterp) {
                              lineNodes.interpretative = evtSearchDocument.getLineNodes(xmlDocDom, interpretativeNodes, prevDocsLbNumber, countLine, ns, nsResolver);
                              cleanedInterpretativeNodes = evtSearchDocument.removeEmptyTextNodes(lineNodes.interpretative);
                           }
                        }
                        while(cleanedFacsimileNodes.length === 0 && cleanedInterpretativeNodes.length === 0 &&
                        lineNodes.facsimile.length !== 0 && lineNodes.interpretative.length !== 0);

                        line.content = {};
                        line.content.facsimile = evtSearchDocument.getContent(lineNodes.facsimile, 'facsimile');

                        if(editionIsInterp) {
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
