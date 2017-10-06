/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtglyph
 *
 * @description
 * # evtGlyph
 * The evtGlyph service manages glyph operation,
 * and it exposes functions to retrieve and act upon them.
 *
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
 */

angular.module('evtviewer.dataHandler')

.service('evtGlyph', function(parsedData, evtInterface) {
   var evtGlyph =  {};

   var currentGlyph,
       glyphId,
       glyphs = [];

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtGlyph#getGlyph
    * @methodOf evtviewer.dataHandler.evtGlyph
    *
    * @description
    * Get the glyph of current node.
    *
    * @param {Object} currentNode The node currently selected
    * @returns {Object} contains glyph id and its diplomatic and interpretative version.
    *
    * @author GC
    */
   evtGlyph.getGlyph = function (currentNode) {
      var glyph = {};

      currentGlyph = evtGlyph.getCurrentGlyph(currentNode);

      glyph.id = glyphId;
      currentGlyph.diplomatic !== undefined ? glyph.diplomatic = currentGlyph.diplomatic.content : glyph.diplomatic = '';
      currentGlyph.normalized !== undefined ? glyph.interpretative = currentGlyph.normalized.content: glyph.interpretative = '';

      return glyph;
   };

   evtGlyph.getGlyphs = function() {
      var glyphs = parsedData.getGlyphs();
      return glyphs;
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
    * interpretative verion.
    *
    * @author GC
    */
   evtGlyph.addGlyphs = function (glyph) {
      var found;

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
    * @param {string} text contain the text of the document
    * @returns {string} the text of the document
    *
    * @author GC
    */
   evtGlyph.addGlyph = function (currentGlyph) {
      var currentEdition;

      currentEdition = evtInterface.getState('currentEdition');

      switch (currentEdition) {
         case 'diplomatic':
            return currentGlyph.diplomatic;
            break;
         case 'interpretative':
            return currentGlyph.interpretative;
            break;
      }
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
   evtGlyph.getCurrentGlyph = function (node) {
      var sRef,
          glyphs = evtGlyph.getGlyphs();

      sRef = node.getAttribute('ref');
      sRef = sRef.replace('#', '');
      glyphId = sRef;

      currentGlyph = glyphs[sRef].mapping;
      return currentGlyph;
   };

   return evtGlyph;
});
