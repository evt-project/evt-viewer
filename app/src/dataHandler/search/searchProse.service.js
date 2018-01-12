//TODO add documentation
angular.module('evtviewer.dataHandler')
.service('evtSearchProse', ['XPATH', function Prose(XPATH) {
   
   //TODO add documentation
   Prose.prototype.getDiplomaticLineNodes = function (countLine, diplomaticNodes, ns, nsResolver) {
      var lineNodes = [],
         prevLb,
         hasPrevLb;
      
      for (var i = 0; i < diplomaticNodes.length;) {
         prevLb = ns ? $(diplomaticNodes[i]).xpath(XPATH.ns.getPrevLb, nsResolver)
                     : $(diplomaticNodes[i]).xpath(XPATH.getPrevLb);
         
         hasPrevLb = prevLb.length !== 0;
         
         if (hasPrevLb) {
            if (countLine === prevLb.length) {
               lineNodes.push(diplomaticNodes[i]);
               diplomaticNodes.splice(diplomaticNodes[i], 1);
            }
            else {
               return lineNodes;
            }
         }
         else {
            diplomaticNodes.splice(diplomaticNodes[i], 1);
         }
      }
      return lineNodes;
   };
   
}]);
