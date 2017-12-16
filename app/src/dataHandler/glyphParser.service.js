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
 * @returns {Object} EvtGlyph object
 */

angular.module('evtviewer.dataHandler')

.factory('evtGlyph', function(parsedData) {

   //EvtGlyph constructor
   function EvtGlyph() {
   }

   EvtGlyph.Glyph = function Glyph() {};

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtGlyph.Glyph#getGlyph
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
   EvtGlyph.Glyph.prototype.getGlyph = function (currentNode) {
      var currentGlyph,
          glyph = {};

      currentGlyph = EvtGlyph.Glyph.prototype.getCurrentGlyph(currentNode);

      glyph.id = EvtGlyph.Glyph.glyphId;
      glyph.diplomatic = currentGlyph.diplomatic !== undefined ? currentGlyph.diplomatic.content : '';
      glyph.interpretative = currentGlyph.normalized !== undefined ? currentGlyph.normalized.content : '';

      return glyph;
   };

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtGlyph.Glyph#getCurrentGlyph
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
   EvtGlyph.Glyph.prototype.getCurrentGlyph = function (node) {
      var currentGlyph,
          sRef,
          glyphs = parsedData.getGlyphs();

      sRef = node.getAttribute('ref');
      sRef = sRef.replace('#', '');
      EvtGlyph.Glyph.glyphId = sRef;

      currentGlyph = glyphs[sRef].mapping;
      return currentGlyph;
   };

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtGlyph.Glyph#addGlyphs
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
   EvtGlyph.Glyph.prototype.addGlyphs = function (glyph) {
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
    * @name evtviewer.dataHandler.evtGlyph.Glyph#addGlyph
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
   EvtGlyph.Glyph.prototype.addGlyph = function (currentGlyph, currentEdition) {
      switch (currentEdition) {
         case 'diplomatic':
            return currentGlyph.diplomatic;
         case 'interpretative':
            return currentGlyph.interpretative;
      }
   };

   return EvtGlyph;
});
