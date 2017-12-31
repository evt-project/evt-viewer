var jqueryxpath = require('jquery-xpath/jquery.xpath.js');
var lunr = require('lunr');

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

.service('evtSearchDocument', ['evtSearchPoetry', 'parsedData', function Doc(evtSearchPoetry, parsedData) {
      this.ns = false;
      this.nsResolver = '';
      this.Poetry = evtSearchPoetry;

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
   Doc.prototype.hasNamespace = function(xmlDocDom) {
      var ns = xmlDocDom.documentElement.namespaceURI;
      if(ns !== null) {
         this.ns = true;
         this.nsResolver = function(prefix) {
            if(prefix === 'ns') {
               return xmlDocDom.documentElement.namespaceURI;
            }
         };
      }
      return this.ns;
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
   function getCurrentDocs() {
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
   }

   //TODO add documentation
   Doc.prototype.parsePoetry = function(xmlDocDom, currentEdition, ns, nsResolver) {
      var docs = getCurrentDocs();
      //var criticalHandler = evtBuilder.create(Doc, 'CriticalEditionHandler');
      var lines = [];
      lines = this.Poetry.parseLines(xmlDocDom, lines, currentEdition, /*criticalHandler,*/ docs, ns, nsResolver);
      console.log(lines);
   };
}]);
