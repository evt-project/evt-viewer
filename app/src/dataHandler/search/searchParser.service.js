/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.search.evtSearchParser
 * @description
 * # evtSearchParser
 * In this service is defined a constructor and his object. The object exposed methods to handle search parser.
 *
 * @requires evtviewer.dataHandler.search.evtSearchDocument
 *
 * @returns {object} Parser object
 *
 * @author GC
 */

angular.module('evtviewer.dataHandler')
   .factory('evtAbstractSearchParserInterface', ['EvtSearchInterface', function (EvtSearchInterface) {
      return new EvtSearchInterface('evtAbstractSearchParserInterface', ['parseElements', 'getPrevDocsLines']);
   }]);
