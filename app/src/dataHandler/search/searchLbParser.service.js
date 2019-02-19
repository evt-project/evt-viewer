/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.search.evtSearchParser
 * @description
 * # evtSearchParser
 * In this service is defined a constructor and his object. The object exposed methods to handle search parser.
 *
 * @requires evtviewer.dataHandler.search.evtSearchDocument
 *
 * @returns {object} Parser object
 *
 * @author GC
 */

angular.module('evtviewer.dataHandler')
   .factory('EvtLbParser', ['evtSearchDocument', 'evtDiplomaticEditionHandler', 'evtInterpretativeEditionHandler', 'evtSearchDiploInterprLbHandler', 'evtSearchDiplomaticLbHandler', 'evtGlyph', 'Utils', 'XPATH',
      function (evtSearchDocument, evtDiplomaticEditionHandler, evtInterpretativeEditionHandler, evtSearchDiploInterprLbHandler, evtSearchDiplomaticLbHandler, evtGlyph, Utils, XPATH) {
      
      function LbParser(xmlDocBody) {
         this.parsedElementsForIndexing = {};
         this.xmlDocBody = xmlDocBody;
      }
      
      LbParser.prototype.getPrevDocsLines = function () {
         return this.parsedElementsForIndexing.countAllLines;
      };
      
      LbParser.prototype.parseElements = function (prevDocsLbNumber) {
         var ns,
            nsResolver,
            xmlDocDom = this.xmlDocBody.ownerDocument;
         
         evtSearchDocument.hasNamespace(xmlDocDom);
         ns = evtSearchDocument.ns;
         nsResolver = evtSearchDocument.nsResolver;
         
         this.parsedElementsForIndexing = getLbLines(this.xmlDocBody.ownerDocument, this.xmlDocBody, prevDocsLbNumber, ns, nsResolver);
         return this.parsedElementsForIndexing;
      };
      
      function getLbLines(xmlDocDom, xmlDocBody, prevDocsLbNumber, ns, nsResolver) {
         var lines = [],
            lbNodes = getFilteredNodes(xmlDocDom, xmlDocBody, ns, nsResolver);
         
         lines = getLineInfo(xmlDocDom, xmlDocBody, lbNodes, prevDocsLbNumber, ns, nsResolver);
         return lines;
      }
      
      function getFilteredNodes(xmlDocDom, xmlDocBody, ns, nsResolver) {
         return ns ? xmlDocDom.evaluate(XPATH.ns.getLineNodes, xmlDocBody, nsResolver, XPathResult.ANY_TYPE, null)
            : xmlDocDom.evaluate(XPATH.getLineNodes, xmlDocBody, null, XPathResult.ANY_TYPE, null);
      }
      
      function getLineInfo(xmlDocDom, xmlDocBody, lbNodes, prevDocsLbNumber, ns, nsResolver) {
         return evtSearchDocument.isOnlyDiplomaticEdition(xmlDocBody) ? evtSearchDiplomaticLbHandler.getLineInfo(xmlDocDom, xmlDocBody, lbNodes, prevDocsLbNumber, ns, nsResolver)
                                                                  : evtSearchDiploInterprLbHandler.getLineInfo(xmlDocDom, xmlDocBody, lbNodes, prevDocsLbNumber, ns, nsResolver);
      }
      
      return LbParser;
   }]);
