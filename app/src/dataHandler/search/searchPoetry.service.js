/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.search.evtSearchPoetry
 *
 * @description
 * # evtSearchDocument
 * In this service are defined and exposed methods to parse poetic Documents
 *
 * @requires evtviewer.dataHandler.evtGlyph
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.core.Utils
 * @requires evtviewer.core.XPATH
 */
angular.module('evtviewer.dataHandler')

.service('evtSearchPoetry', ['evtGlyph', 'parsedData', 'Utils', 'XPATH', function Poetry(evtGlyph, parsedData, Utils, XPATH) {

   Poetry.prototype.getDiplomaticLineNodes = function(node, nodes, ns, nsResolver) {
      nodes = ns ? $(node).xpath(XPATH.ns.getDiplomaticChildNodes, nsResolver)
                  : $(node).xpath(XPATH.getDiplomaticChildNodes);
      return nodes;
   };
}]);
