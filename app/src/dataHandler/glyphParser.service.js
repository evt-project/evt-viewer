/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtGlyph
 *
 * @description
 * # evtGlyph
 * The evtGlyph service manages glyph operation,
 * and it exposes functions to retrieve and act upon them.
 *
 * @requires evtviewer.dataHandler.parsedData
 *
 */

angular.module('evtviewer.dataHandler')
   .service('evtGlyph', ['parsedData', function Glyph(parsedData) {
      
      /**
       * @ngdoc method
       * @name evtviewer.dataHandler.evtGlyph#getGlyph
       * @methodOf evtviewer.dataHandler.evtGlyph
       *
       * @description
       * Get the glyph of current node.
       *
       * @param {Object} currentNode the node currently selected
       * @returns {Object} contains glyph id and its diplomatic and interpretative version.
       *
       * @author GC
       */
      Glyph.prototype.getGlyph = function (node, editionType) {
         var currentGlyph = getCurrentGlyph(node),
            isRune = currentGlyph.runic,
            edition = {};
         
         if(isRune) {
            edition = {
               'diplomatic': function () {
                  return currentGlyph.runic !== undefined ? currentGlyph.runic.content : '';
               },
               'interpretative': function () {
                  return currentGlyph.transliterated !== undefined ? currentGlyph.transliterated.content : '';
               }
            };
         }
         else {
            edition = {
               'diplomatic': function () {
                  return currentGlyph.diplomatic !== undefined ? currentGlyph.diplomatic.content : '';
               },
               'interpretative': function () {
                  return currentGlyph.normalized !== undefined ? currentGlyph.normalized.content : '';
               }
            };
         }
         
         
         return edition[editionType]();
      };
      
      /**
       * @ngdoc method
       * @name evtviewer.dataHandler.evtGlyph#getCurrentGlyph
       * @methodOf evtviewer.dataHandler.evtGlyph
       *
       * @description
       * Get the current glyph.
       *
       * @param {Object} node the current node
       * @returns {Object} the current glyph, that contains information about codepoint, diplomatic and interpretative version.
       *
       * @author GC
       */
      function getCurrentGlyph(node) {
         var currentGlyph,
            glyphs = parsedData.getGlyphs(),
            sRef = node.getAttribute('ref');
         
         try {
            sRef = sRef.replace('#', '');
            currentGlyph = glyphs[sRef].mapping;
            currentGlyph.id = sRef;
         }
         catch(e) {
            console.log(e);
            return true;
         }
         
         return currentGlyph;
      }
   }]);
