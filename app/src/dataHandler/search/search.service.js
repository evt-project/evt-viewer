/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtSearch
 * @description
 * # evtSearch
 * In this service is defined a constructor and his objects. The objects exposed methods to handle search feature.
 *
 * @requires evtviewer.dataHandler.evtSearchParser
 *
 * @returns {object} EvtSearch object
 *
 * @author GC
 */
angular.module('evtviewer.dataHandler')

.factory('evtSearch', function(evtSearchParser) {
   //EvtSearch constructor
   function EvtSearch() {}

   EvtSearch.Parser = evtSearchParser;
   EvtSearch.Index = '';
   EvtSearch.Search = '';

   return EvtSearch;
});
