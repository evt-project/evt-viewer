angular.module('evtviewer.dataHandler')
   .factory('EvtSearchDiplomaticParLineParser', ['evtSearchDocument', 'XPATH', function (evtSearchDocument, XPATH) {
      function DiplomaticParLineParser(xmlDocBody) {
         this.parsedElementsForIndexing = {};
         this.xmlDocBody = xmlDocBody;
      }
   
      DiplomaticParLineParser.prototype.getPrevDocsInfo = function () {};
      
      DiplomaticParLineParser.prototype.parseElements = function () {
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
                     documentToIndex.page = currentPage;
                     documentToIndex.pageId = currentPageId;
                     
                     var nodeName = {
                        'p': function() {
                           paragraph = evtSearchDocument.getParagraph(node, parId);
                           documentToIndex.paragraph = paragraph;
                           documentToIndex.docId = documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.paragraph;
                        }
                     }
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
      }
      
      function getChildNodes(xmlDocDom, node, ns, nsResolver) {
         return ns ? xmlDocDom.evaluate(XPATH.ns.getChildNodes, node, nsResolver, XPathResult.ANY_TYPE, null)
            : xmlDocDom.evaluate(XPATH.getChildNodes, node, null, XPathResult.ANY_TYPE, null);
      }
      
      return DiplomaticParLineParser;
   }]);
