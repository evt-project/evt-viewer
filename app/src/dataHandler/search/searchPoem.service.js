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

   Poem.prototype.getDiplomaticLineNodes = function(xmlDocDom, node, nodes, ns, nsResolver) {
      nodes = ns ? xmlDocDom.evaluate(XPATH.ns.getDiplomaticChildNodes, node, nsResolver, XPathResult.ANY_TYPE, null)
                 : xmlDocDom.evaluate(XPATH.getDiplomaticChildNodes, node, null, XPathResult.ANY_TYPE, null);
      return nodes;
   };
   
   Poem.prototype.getInterpretativeLineNodes = function(xmlDocDom, node, nodes, ns, nsResolver) {
      nodes = ns ? xmlDocDom.evaluate(XPATH.ns.getInterpretativeChildNodes, node, nsResolver, XPathResult.ANY_TYPE, null)
                 : xmlDocDom.evaluate(XPATH.getInterpretativeChildNodes, node, null, XPathResult.ANY_TYPE, null);
      return nodes;
   };
   
}]);
