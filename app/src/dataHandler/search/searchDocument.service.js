import 'jquery-xpath/jquery.xpath.js';

/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtSearchDocument
 *
 * @description
 * # evtSearchDocument
 * In this service are defined and exposed methods to parse Document
 *
 * @requires evtviewer.dataHandler.evtBuilder
 * @requires evtviewer.dataHandler.evtGlyph
 * @requires evtviewer.dataHandler.parseData
 * @requires evtviewer.core.Utils
 */
angular.module('evtviewer.dataHandler')

.factory('evtSearchDocument', function(evtBuilder, evtSearchPoetry, parsedData) {
   //Doc constructor
   function Doc() {
      this.namespace = false;
      this.nsResolver = '';
      this.title = '';
   }

   Doc.Poetry = evtSearchPoetry;
   //Doc.Prose = evtSearchProse;

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#hasNamespace
    * @methodOf evtviewer.dataHandler.evtSearchDocument
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
   Doc.prototype.hasNamespace = function(xmlDocDom) {
      var ns = xmlDocDom.documentElement.namespaceURI;
      if(ns !== null) {
         this.namespace = true;
         this.nsResolver = function(prefix) {
            if(prefix === 'ns') {
               return xmlDocDom.documentElement.namespaceURI;
            }
         };
      }
      return this.namespace;
   };

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getCurrentDocs
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get the title the currents docs
    *
    * @returns {array} return a collection of docs
    *
    * @author GC
    */
   Doc.prototype.getCurrentDocs = function() {
      var documents = parsedData.getDocuments(),
          docIndexes = documents._indexes,
          docId,
          document,
          docs = [],
          doc = {};

      for(var i = 0; i < docIndexes.length; i++) {
         docId = docIndexes[i];
         document = documents[docId];
         doc.title = document.title;
         docs.push(doc);
         doc = {};
      }

      return docs;
   };

   //TODO add documentation
   Doc.prototype.parsePoetry = function(xmlDocDom, currentEdition, ns, nsResolver) {
      var docs = Doc.prototype.getCurrentDocs();
      var poetry = evtBuilder.create(Doc, 'Poetry');
      var lines = [];
      lines = poetry.parseLines(xmlDocDom, lines, currentEdition, docs, ns, nsResolver);
      console.log(lines);
   };

   return Doc;
});
