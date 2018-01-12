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

.service('evtSearchPoem', ['evtGlyph', 'parsedData', 'Utils', 'XPATH', function Poem(evtGlyph, parsedData, Utils, XPATH) {

   Poem.prototype.getDiplomaticLineNodes = function(node, nodes, ns, nsResolver) {
      nodes = ns ? $(node).xpath(XPATH.ns.getDiplomaticChildNodes, nsResolver)
                  : $(node).xpath(XPATH.getDiplomaticChildNodes);
      return nodes;
   };
}]);
