//TODO add documentation
angular.module('evtviewer.dataHandler')
.service('evtSearchProse', ['XPATH', function Prose(XPATH) {
   
   //TODO add documentation
   Prose.prototype.getLineNodes = function (countLine, proseLineNodes, ns, nsResolver) {
      var lineNodes = [],
         prevLb,
         hasPrevLb;
      
      for (var i = 0; i < proseLineNodes.length;) {
         prevLb = ns ? $(proseLineNodes[i]).xpath(XPATH.ns.getPrevLb, nsResolver)
                     : $(proseLineNodes[i]).xpath(XPATH.getPrevLb);
         
         hasPrevLb = prevLb.length !== 0;
         
         if (hasPrevLb) {
            if (countLine === prevLb.length) {
               lineNodes.push(proseLineNodes[i]);
               proseLineNodes.splice(proseLineNodes[i], 1);
            }
            else {
               return lineNodes;
            }
         }
         else {
            proseLineNodes.splice(proseLineNodes[i], 1);
         }
      }
      return lineNodes;
   };
   
}]);
