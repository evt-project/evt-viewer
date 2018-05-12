angular.module('evtviewer.dataHandler')
   .service('evtParagraphHandler', ['evtSearchDocument', 'evtDiplomaticEditionHandler', 'evtInterpretativeEditionHandler',
      function Paragraph(evtSearchDocument, evtDiplomaticEditionHandler, evtInterpretativeEditionHandler) {
      
      Paragraph.prototype.getParagraphInfo = function(xmlDocDom, currentXmlDoc, node, currentPage, currentPageId, pageId, documentsToIndex, ns, nsResolver) {
         var paragraph,
            parId = 1,
            documentToIndex = {};
         
         var diplomaticNodes = evtDiplomaticEditionHandler.getParagraphDiplomaticNodes(xmlDocDom, node, ns, nsResolver),
            interpretativeNodes = evtInterpretativeEditionHandler.getParagraphInterpretativeNodes(xmlDocDom, node, ns, nsResolver);
   
         for(var i = 0; i < diplomaticNodes.length;) {
            var currentParDiplomaticNodes,
               currentParInterpretativeNodes;
      
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
      
            currentParDiplomaticNodes = evtSearchDocument.getCurrentPageParNodes(xmlDocDom, diplomaticNodes);
            currentParInterpretativeNodes = evtSearchDocument.getCurrentPageParNodes(xmlDocDom, interpretativeNodes);
      
            documentToIndex.content = {
               diplomatic: evtSearchDocument.getContent(currentParDiplomaticNodes, 'diplomatic'),
               interpretative: evtSearchDocument.getContent(currentParInterpretativeNodes, 'interpretative')
            };
      
            documentsToIndex[documentToIndex.docId] = documentToIndex;
            currentParDiplomaticNodes = [];
            currentParInterpretativeNodes = [];
            documentToIndex = {};
         }
         parId++;
      };
   }]);
