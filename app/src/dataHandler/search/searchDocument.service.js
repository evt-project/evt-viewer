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

.service('evtSearchDocument', ['evtSearchPoetry', 'evtSearchProse', 'parsedData', function Doc(evtSearchPoetry, evtSearchProse, parsedData) {
      this.ns = false;
      this.nsResolver = '';
      this.Poetry = evtSearchPoetry;
      this.Prose = evtSearchProse;

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
   Doc.prototype.getDocsTitle = function() {
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

   Doc.prototype.getDocType = function(xmlDocDom, ns, nsResolver) {
      var type = ''
      var verse = $(xmlDocDom).xpath('//ns:body//ns:l', nsResolver).length !== 0;
      var prose = $(xmlDocDom).xpath('//ns:body//ns:p', nsResolver).length !== 0;

      if(verse) {
         type = 'verse';
      }
      else if(prose) {
         type = 'prose';
      }

      return type;
   };

   //TODO add documentation
   Doc.prototype.parsePoetry = function(xmlDocDom, currentEdition, docs, ns, nsResolver) {
      //var criticalHandler = evtBuilder.create(Doc, 'CriticalEditionHandler');
      var lines = [];
      lines = this.Poetry.parseLines(xmlDocDom, lines, currentEdition, /*criticalHandler,*/ docs, ns, nsResolver);
      console.log(lines);
   };

   Doc.prototype.parseProse = function(xmlDocDom, currentEdition, docs, ns, nsResolver) {

   };
}]);
