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
   .service('evtSearchDocument', ['parsedData', function XmlDoc(parsedData) {
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
      
      XmlDoc.prototype.hasLineElement = function (xmlDocBody) {
         return xmlDocBody.getElementsByTagName('l') !== 0 && xmlDocBody.getElementsByTagName('lb').length === 0;
      };
      
      XmlDoc.prototype.getXmlDocBody = function (xmlDocDom) {
         return xmlDocDom.getElementsByTagName('body');
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
      XmlDoc.prototype.getXmlDocumentsTitles = function () {
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
      };
      
      XmlDoc.prototype.removeNoteElements = function (xmlDocDom) {
         var noteElements = xmlDocDom.getElementsByTagName('note');
         
         while (noteElements.length > 0) {
            noteElements[0].parentNode.removeChild(noteElements[0]);
         }
      };
   }]);
