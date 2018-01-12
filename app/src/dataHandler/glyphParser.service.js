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
   this.glyphId = '';

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
         sRef,
         glyphs = parsedData.getGlyphs();

      sRef = node.getAttribute('ref');
      sRef = sRef.replace('#', '');
      Glyph.glyphId = sRef;

      currentGlyph = glyphs[sRef].mapping;
      currentGlyph.id = Glyph.glyphId;
      return currentGlyph;
   }

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
   Glyph.prototype.getGlyph = function (currentNode) {
      var currentGlyph,
          glyph = {};

      currentGlyph = getCurrentGlyph(currentNode);

      glyph.id = currentGlyph.id;
      glyph.diplomatic = currentGlyph.diplomatic !== undefined ? currentGlyph.diplomatic.content : '';
      glyph.interpretative = currentGlyph.normalized !== undefined ? currentGlyph.normalized.content : '';

      return glyph;
   };

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtGlyph#addGlyphs
    * @methodOf evtviewer.dataHandler.evtGlyph
    *
    * @description
    * Add the current glyph to an array.
    *
    * @param {Object} glyph the current glyph, that contains an id and the diplomatic and interpretative version.
    * @returns {Array} an array of all glyphs in the document. Each glyph contains an id and its diplomatic and
    * interpretative version.
    *
    * @author GC
    */
   Glyph.prototype.addGlyphs = function (glyph) {
      var found,
          glyphs = [];

      if (glyphs.length === 0) {
         glyphs.push(glyph);
      }
      found = glyphs.some(function (element) {
         return element.id === glyph.id;
      });
      if (!found) {
         glyphs.push(glyph);
      }
      return glyphs;
   };

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtGlyph#addGlyph
    * @methodOf evtviewer.dataHandler.evtGlyph
    *
    * @description
    * Adds the current glyph in a string, that contain the text of the document.
    *
    * @param {Object} currentGlyph the current glyph, that contains information about codepoint, diplomatic and interpretative version
    * @param {Object} currentEdition the current edition
    * @returns {string} the text of the document
    *
    * @author GC
    */
   Glyph.prototype.addGlyph = function (currentGlyph, editionType) {
      switch (editionType) {
         case 'diplomatic':
            return currentGlyph.diplomatic;
         case 'interpretative':
            return currentGlyph.interpretative;
      }
   };
}]);
