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
   .service('evtSearchDocument', ['parsedData', 'XPATH', function XmlDoc(parsedData, XPATH) {
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
      
      XmlDoc.prototype.removeNoteElements = function (xmlDocDom) {
         var noteElements = xmlDocDom.getElementsByTagName('note');
         
         while (noteElements.length > 0) {
            noteElements[0].parentNode.removeChild(noteElements[0]);
         }
      };
   }]);
