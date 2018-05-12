angular.module('evtviewer.dataHandler')
   .service('evtInterpretativeEditionHandler', ['XPATH', function InterpretativeEdition(XPATH) {
      
      InterpretativeEdition.prototype.getInterpretativeNodes = function (xmlDocDom, xmlDocBody, ns, nsResolver) {
         var interpretativeNodes = [],
            interpretativeNodesSnapshot = ns ? xmlDocDom.evaluate(XPATH.ns.getInterpretativeNodes, xmlDocBody, nsResolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
               : xmlDocDom.evaluate(XPATH.getInterpretativeNodes, xmlDocBody, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
         for (var i = 0; i < interpretativeNodesSnapshot.snapshotLength; i++) {
            interpretativeNodes.push(interpretativeNodesSnapshot.snapshotItem(i));
         }
         return interpretativeNodes;
      };
   
      InterpretativeEdition.prototype.getInterpretativeChildNodes = function (xmlDocDom, node, ns, nsResolver) {
         var interpretativeNodes = [],
            interpretativeNodesSnapshot = ns ? xmlDocDom.evaluate(XPATH.ns.getInterpretativeChildNodes, node, nsResolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
               : xmlDocDom.evaluate(XPATH.getInterpretativeChildNodes, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
         for (var i = 0; i < interpretativeNodesSnapshot.snapshotLength; i++) {
            interpretativeNodes.push(interpretativeNodesSnapshot.snapshotItem(i));
         }
         return interpretativeNodes;
      };
   }]);
