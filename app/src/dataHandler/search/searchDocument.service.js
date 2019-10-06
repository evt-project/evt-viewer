/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.search.evtSearchDocument
 *
 * @description
 * # evtSearchDocument
 * In this service are defined and exposed methods to parse Document
 *
 * @requires evtviewer.dataHandler.search.evtSearchPoetry
 * @requires evtviewer.dataHandler.parsedData
 */
angular.module('evtviewer.dataHandler')
   .service('evtSearchDocument', ['parsedData', 'evtGlyph', 'XPATH', 'Utils', 'config', function XmlDoc(parsedData, evtGlyph, XPATH, Utils, config) {
      var xmlDoc = this;
      
      xmlDoc.ns = false;
      xmlDoc.nsResolver = '';
      
      /**
       * @ngdoc method
       * @module evtviewer.dataHandler
       * @name evtviewer.dataHandler.search.evtSearchDocument#hasNamespace
       * @methodOf evtviewer.dataHandler.search.evtSearchDocument
       *
       * @description
       * This method check if XML document has a namespace
       *
       * @param {element} xmlDocDom XML element to be parsed
       *
       * @returns {boolean} return false if the document hasn't a namespace
       *
       * @author GC
       */
      XmlDoc.prototype.hasNamespace = function (xmlDocDom) {
         var ns = xmlDocDom.documentElement.namespaceURI;
         if (ns !== null) {
            xmlDoc.ns = true;
            xmlDoc.nsResolver = function (prefix) {
               if (prefix === 'ns') {
                  return xmlDocDom.documentElement.namespaceURI;
               }
            };
         }
         return xmlDoc.ns;
      };
   
      XmlDoc.prototype.isAlsoInterpEdition = function () {
         var availableEditionLevel = config.availableEditionLevel,
            diplIsAvailable,
            interpIsAvailable;
      
         availableEditionLevel.forEach(function (el) {
            if(el.value === 'diplomatic') {
               diplIsAvailable = el.visible;
            }
            if(el.value === 'interpretative') {
               interpIsAvailable = el.visible;
            }
         });
      
         return diplIsAvailable && interpIsAvailable;
      };
      
      XmlDoc.prototype.hasLbElement = function(xmlDocBody) {
         return xmlDocBody.getElementsByTagName('lb').length !== 0;
      };
      
      XmlDoc.prototype.getXmlDocBody = function (xmlDocDom) {
         return xmlDocDom.getElementsByTagName('body');
      };
      
      XmlDoc.prototype.getCurrentXmlDoc = function(xmlDocDom, xmlDocBody, ns, nsResolver) {
         var xmlDocsTitles = getXmlDocumentsTitles(),
            currentTextNode = ns ? xmlDocDom.evaluate(XPATH.ns.getCurrentTextNode, xmlDocBody, nsResolver, XPathResult.ANY_TYPE, null)
               : xmlDocDom.evaluate(XPATH.getCurrentTextNode, xmlDocBody, null, XPathResult.ANY_TYPE, null);
   
         currentTextNode = currentTextNode.iterateNext();
   
         for (var i in xmlDocsTitles) {
            if (currentTextNode === xmlDocsTitles[i].textNode) {
               return xmlDocsTitles[i];
            }
         }
      };
      
      /**
       * @ngdoc method
       * @module evtviewer.dataHandler
       * @name evtviewer.dataHandler.search.evtSearchDocument#getCurrentDocs
       * @methodOf evtviewer.dataHandler.search.evtSearchDocument
       *
       * @description
       * This method get the title the currents docs
       *
       * @returns {array} return a collection of docs
       *
       * @author GC
       */
      function getXmlDocumentsTitles() {
         var documents = parsedData.getDocuments(),
            docIndexes = documents._indexes,
            xmlDocsTitles = [],
            doc = {};
         
         docIndexes.forEach(function (index) {
            doc.id = index;
            doc.title = documents[doc.id].title;
            doc.textNode = documents[doc.id].content;
            xmlDocsTitles.push(doc);
            doc = {};
         });
         
         return xmlDocsTitles;
      }
      
      XmlDoc.prototype.getCurrentPage = function(node) {
         return node.getAttribute('n');
      };
      
      XmlDoc.prototype.getCurrentPageId = function(node) {
         return node.getAttribute('xml:id') || 'page_' + node.getAttribute('n');
      };
      
      XmlDoc.prototype.getCurrentPageNodes = function (xmlDocDom, nodes) {
         var currentPageNodes = [];
   
         for(var i = 0; i < nodes.length;) {
            if(nodes[i].nodeName !== 'pb') {
               currentPageNodes.push(nodes[i]);
               nodes.splice(0, 1);
            }
            else {
               return currentPageNodes;
            }
         }
         return currentPageNodes;
      };
      
      XmlDoc.prototype.getLineNodes = function(xmlDocDom, nodes, prevDocsLbNumber, countLine, ns, nsResolver) {
         var lineNodes = [],
            prevBody,
            prevLb,
            nodeHasPrevLb,
            nodeIsLb,
            nodeIsPb,
            countPrevLb;
   
         for (var i = 0; i < nodes.length;) {
            prevBody = ns ? xmlDocDom.evaluate(XPATH.ns.getPrevBody, nodes[i], nsResolver, XPathResult.ANY_TYPE, null)
               : xmlDocDom.evaluate(XPATH.getPrevBody, nodes[i], null, XPathResult.ANY_TYPE, null);
      
            prevLb = ns ? xmlDocDom.evaluate(XPATH.ns.getPrevLb, nodes[i], nsResolver, XPathResult.ANY_TYPE, null)
               : xmlDocDom.evaluate(XPATH.getPrevLb, nodes[i], null, XPathResult.ANY_TYPE, null);
      
            //se ci sono più testi allora sottraggo il numero degli <lb> presenti nei testi precedenti al testo corrente,
            // al numero di <lb> precedenti al nodo corrente(nodes[j]) -> sarà sempre maggiore di prevDocsLbNumber.
            // così trovo il numero di <lb> che nel testo corrente precedono il nodo corrente
            //countPrevLb = prevBody.numberValue >= 1 ? prevLb.numberValue - prevDocsLbNumber : prevLb.numberValue;
      
            if (prevBody.numberValue >= 1) {
               countPrevLb = prevLb.numberValue - prevDocsLbNumber;
            }
            else {
               countPrevLb = prevLb.numberValue;
            }
   
            nodeHasPrevLb = countPrevLb !== 0;
            nodeIsLb = nodes[i].nodeName === 'lb';
            nodeIsPb = nodes[i].nodeName === 'pb';
            
            if (nodeHasPrevLb || nodeIsLb) {
               while(nodeIsLb || nodeIsPb) {
                  nodes.splice(0, 1);
                  if(nodes.length === 0) {
                     return;
                  }
                  nodeIsLb = nodes[i].nodeName === 'lb';
                  nodeIsPb = nodes[i].nodeName === 'pb';
               }
               while(nodes[i] !== undefined && nodes[i].nodeName !== 'lb' && nodes[i].nodeName !== 'pb') {
                  lineNodes.push(nodes[i]);
                  nodes.splice(0, 1);
               }
               return lineNodes;
            }
            else {
               nodes.splice(0, 1);
            }
         }
         return lineNodes;
      };
   
      /* from array */
      XmlDoc.prototype.removeEmptyTextNodes = function (nodes) {
        return nodes.filter(
           function (node) {
              var isEmptyTextNode = node.nodeName === '#text' && node.textContent.trim() === '',
                isTextNode = node.nodeName === '#text';
              return !isEmptyTextNode || !isTextNode;
         });
      };
      
      XmlDoc.prototype.getChildNodes = function (xmlDocDom, node, ns, nsResolver) {
         var nodes = [],
            currentNode,
            childNodes = ns ? xmlDocDom.evaluate(XPATH.ns.getChildNodes, node, nsResolver, XPathResult.ANY_TYPE, null)
                             : xmlDocDom.evaluate(XPATH.getChildNodes, node, null, XPathResult.ANY_TYPE, null);
         
         currentNode = childNodes.iterateNext();
         while(currentNode !== null) {
            nodes.push(currentNode);
            currentNode = childNodes.iterateNext();
         }
         return nodes;
      };
      
      XmlDoc.prototype.getBodyTextGlyphNodes = function (xmlDocDom, xmlDocBody, ns, nsResolver) {
         var nodes = [],
            currentNode,
            childNodes = ns ? xmlDocDom.evaluate(XPATH.ns.getTextGlyphNodes, xmlDocBody, nsResolver, XPathResult.ANY_TYPE, null)
               : xmlDocDom.evaluate(XPATH.getTextGlyphNodes, xmlDocBody, null, XPathResult.ANY_TYPE, null);
   
         currentNode = childNodes.iterateNext();
         while(currentNode !== null) {
            nodes.push(currentNode);
            currentNode = childNodes.iterateNext();
         }
         return nodes;
      };
      
      XmlDoc.prototype.getParagraph = function(node, parId) {
        return node.getAttribute('n') || parId.toString();
      };
      
      XmlDoc.prototype.getLine = function(node, lineId) {
         return node.getAttribute('n') || lineId.toString();
      };
      
      XmlDoc.prototype.getContent = function(nodes, editionType) {
         var nodeName,
            currentGlyph,
            text = '';
   
         nodes.forEach(function (node) {
            nodeName = {
               'g': function () {
                  currentGlyph = evtGlyph.getGlyph(node, editionType);
                  text += currentGlyph;
               },
               '#text': function () {
                  text += node.textContent;
               }
            };
            nodeName[node.nodeName]();
         });
         
         return Utils.cleanSpace(text);
      };
      
      XmlDoc.prototype.removeNoteElements = function (xmlDocDom) {
         var noteElements = xmlDocDom.getElementsByTagName('note');
         
         while (noteElements.length > 0) {
            noteElements[0].parentNode.removeChild(noteElements[0]);
         }
      };
   
      XmlDoc.prototype.removeAddElements = function (xmlDocDom) {
         var addElements = xmlDocDom.getElementsByTagName('add');
      
         while (addElements.length > 0) {
            addElements[0].parentNode.removeChild(addElements[0]);
         }
      };
   }]);
