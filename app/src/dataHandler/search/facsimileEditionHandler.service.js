angular.module('evtviewer.dataHandler')
   .service('evtFacsimileEditionHandler', ['XPATH', function FacsimileEdition(XPATH) {

      FacsimileEdition.prototype.getFacsimileNodes = function (xmlDocDom, xmlDocBody, ns, nsResolver) {
         var facsimileNodes = [],
            facsimileNodesSnapshot = ns ? xmlDocDom.evaluate(XPATH.ns.getFacsimileNodes, xmlDocBody, nsResolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
               : xmlDocDom.evaluate(XPATH.getFacsimileNodes, xmlDocBody, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
         for (var i = 0; i < facsimileNodesSnapshot.snapshotLength; i++) {
            facsimileNodes.push(facsimileNodesSnapshot.snapshotItem(i));
         }
         return facsimileNodes;
      };

      FacsimileEdition.prototype.getFacsimileChildNodes = function (xmlDocDom, node, ns, nsResolver) {
        var facsimileNodes = [],
           facsimileNodesSnapshot = ns ? xmlDocDom.evaluate(XPATH.ns.getFacsimileChildNodes, node, nsResolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
              : xmlDocDom.evaluate(XPATH.getFacsimileChildNodes, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
         for (var i = 0; i < facsimileNodesSnapshot.snapshotLength; i++) {
            facsimileNodes.push(facsimileNodesSnapshot.snapshotItem(i));
         }
         return facsimileNodes;
      };
   }]);
