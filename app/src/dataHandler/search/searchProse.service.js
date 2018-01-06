//TODO add documentation
angular.module('evtviewer.dataHandler')
.service('evtSearchProse', ['evtGlyph', 'XPATH', 'Utils', function Prose(evtGlyph, XPATH, Utils) {

   //TODO add documentation
   Prose.prototype.getDiplomaticLineNodes = function(xmlDocDom, nodes, node, ns, nsResolver) {
      var hasFollowingLb = $(node).xpath('.//following::ns:lb', nsResolver).length !== 0;
      
      if(hasFollowingLb) {
         console.time('XPATH-INTERSECT');
         nodes = ns ? $(node).xpath(XPATH.ns.getDiplomaticNodesBetween, nsResolver)
                    : $(node).xpath(XPATH.getDiplomaticNodesBetween);
         console.timeEnd('XPATH-INTERSECT');
   
      }
      else {
         nodes = ns ? $(node).xpath(XPATH.ns.getDiplomaticNodesFollowing, nsResolver)
                    : $(node).xpath(XPATH.getDiplomaticNodesFollowing);
      }

      return nodes;
   };
}]);
