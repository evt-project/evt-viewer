/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtSearchParser
 * @description
 * # evtSearchParser
 * In this service is defined a constructor and his object. The object exposed methods to handle search parser.
 *
 * @requires evtviewer.dataHandler.evtSearchParser
 *
 * @returns {object} Parser object
 *
 * @author GC
 */

angular.module('evtviewer.dataHandler')
.factory('evtSearchParser', function(evtSearchDocument, evtBuilder) {
   //Parser constructor
   function Parser() {}

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchParser#parseDocument
    *
    *
    * @description
    * This method parse a specific XML document.
    *
    * @param {element} xmlDocDom XML element to be parsed
    * @param {str} currentEdition The document's current edition (diplomatic, interpretative or critical)
    *
    * @author GC
    */
   Parser.prototype.parseDocument = function (xmlDocDom, currentEdition) {

      var doc = evtBuilder.create(Parser, 'Doc');
      doc.hasNamespace(xmlDocDom);
      doc.parsePoetry(xmlDocDom, currentEdition);
   };

   Parser.Doc = evtSearchDocument;

   return Parser;
});
