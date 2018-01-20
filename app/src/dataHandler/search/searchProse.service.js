//TODO add documentation
angular.module('evtviewer.dataHandler')
.service('evtSearchProse', ['XPATH', function Prose(XPATH) {
   
   //TODO add documentation
   Prose.prototype.getLineNodes = function (xmlDocDom, countLine, proseLineNodes, ns, nsResolver) {
      var lineNodes = [],
         proseLineNode,
         prevLb,
         hasPrevLb;
      
      proseLineNode = proseLineNodes.iterateNext();
      
      while(proseLineNode !== null) {
         prevLb = xmlDocDom.evaluate(XPATH.ns.getPrevLb, proseLineNode, nsResolver, XPathResult.ANY_TYPE, null);
         hasPrevLb = prevLb.numberValue !== 0;
         
         if (hasPrevLb === true) {
            if (countLine === prevLb.numberValue) {
               lineNodes.push(proseLineNode);
            }
            else {
               return lineNodes;
            }
         }
         else {
            proseLineNode = proseLineNodes.iterateNext();
         }
         
         proseLineNode = proseLineNodes.iterateNext();
      }
      
      return lineNodes;
   };
   
}]);
