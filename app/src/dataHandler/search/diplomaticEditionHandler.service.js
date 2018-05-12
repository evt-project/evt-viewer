angular.module('evtviewer.dataHandler')
   .service('evtDiplomaticEditionHandler', ['XPATH', function DiplomaticEdition(XPATH) {
      
      DiplomaticEdition.prototype.getDiplomaticNodes = function (xmlDocDom, xmlDocBody, ns, nsResolver) {
         var diplomaticNodes = [],
            diplomaticNodesSnapshot = ns ? xmlDocDom.evaluate(XPATH.ns.getDiplomaticNodes, xmlDocBody, nsResolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
               : xmlDocDom.evaluate(XPATH.getDiplomaticNodes, xmlDocBody, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
         for (var i = 0; i < diplomaticNodesSnapshot.snapshotLength; i++) {
            diplomaticNodes.push(diplomaticNodesSnapshot.snapshotItem(i));
         }
         return diplomaticNodes;
      };
      
      DiplomaticEdition.prototype.getDiplomaticChildNodes = function (xmlDocDom, node, ns, nsResolver) {
        var diplomaticNodes = [],
           diplomaticNodesSnapshot = ns ? xmlDocDom.evaluate(XPATH.ns.getDiplomaticChildNodes, node, nsResolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
              : xmlDocDom.evaluate(XPATH.getDiplomaticChildNodes, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
         for (var i = 0; i < diplomaticNodesSnapshot.snapshotLength; i++) {
            diplomaticNodes.push(diplomaticNodesSnapshot.snapshotItem(i));
         }
         return diplomaticNodes;
      };
   }]);
