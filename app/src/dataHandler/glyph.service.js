/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtglyph
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
    * @description Get the glyph of current node.
    * @param {Object} currentNode the node currently selected
    * @returns {Object} contains glyph id and its diplomatic and interpretative version. Example:
    * <pre>
         var glyph = {
            diplomatic = ''
            id = 'Hunc'
            interpretative = 'H'
         };
      </pre>
    */
   evtGlyph.getGlyph = function (currentNode) {
      var glyph = {};

      currentGlyph = getCurrentGlyph(currentNode);

      glyph.id = glyphId;
      currentGlyph.diplomatic !== undefined ? glyph.diplomatic = currentGlyph.diplomatic.content : glyph.diplomatic = '';
      currentGlyph.normalized !== undefined ? glyph.interpretative = currentGlyph.normalized.content: glyph.interpretative = '';

      return glyph;
   };

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtGlyph#addGlyphs
    * @methodOf evtviewer.dataHandler.evtGlyph
    * @description Add the current glyph to an array.
    * @param {Object} glyph the current glyph, that contains an id and the diplomatic and interpretative version
    * @returns {Array} an array of all glyphs in the document. Each glyph contains an id and its diplomatic and
    * interpretative verion. Example:
    * <pre>
         var glyphs = {
            0: {
              diplomatic = ''
              id = 'Hunc'
              interpretative = 'H'
            },
            1: {
              diplomatic = 'ſ'
              id = 'slong'
              interpretative = 's'
            }
         };
      </pre>
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
    * @description Adds the current glyph in a string, that contain the text of the document.
    * @param {Object} currentGlyph the current glyph, that contains information about codepoint, diplomatic and
    * interpretative version
    * @param {string} text contain the text of the document
    * @returns {string} the text of the document
    */
   evtGlyph.addGlyph = function (currentGlyph, text) {
      var currentEdition;

      currentEdition = evtInterface.getState('currentEdition');

      switch (currentEdition) {
         case 'diplomatic':
            text += currentGlyph.diplomatic;
            break;
         case 'interpretative':
            text += currentGlyph.interpretative;
            break;
      }
      return text;
   };

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtGlyph#replaceGlyphTag
    * @methodOf evtviewer.dataHandler.evtGlyph
    * @description Replaces the current glyph tag with the current glyph.
    * @param {Object} node the current node
    * @param {Object} childNode the child node of the child node of the current node
    * @param {string} innerHtml the property innerHtml of the child node of the current node
    * @param {string} outerHtmlChild the property outerHtml of child node of the child node of the current node
    * @returns {string} the string with replaced glyph. Example:
    * <pre>
         replaceGTag = 'reord brnd';
      </pre>
    */
   evtGlyph.replaceGlyphTag = function (node, childNode, innerHtml, outerHtmlChild) {
      var replaceGTag,
          toReplace = outerHtmlChild,
          glyph;

      node = childNode;
      glyph = evtGlyph.getGlyph(node);
      replaceGTag = innerHtml.replace(toReplace, glyph.diplomatic);

      while (replaceGTag.includes(toReplace)) {
         replaceGTag = replaceGTag.replace(toReplace, glyph.diplomatic);
      }

      return replaceGTag;
   };

   /* *************************** */
   /* BEGIN getCurrentGlyph(node) */
   /* ***************************************** */
   /* Function to find a glyph in xml document  */
   /* @doc -> current xml document              */
   /* ***************************************** */

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtGlyph#getCurrentGlyph
    * @methodOf evtviewer.dataHandler.evtGlyph
    * @description Get the current glyph
    * @param {Object} node the current node
    * @returns {Object} the current glyph, that contains information about codepoint, diplomatic and
    * interpretative version. Example:
    * <pre>
         currentGlyph = {
            codepoint: {
               attributes: [],
               content: 'U+FF10',
               element: '<mapping subtype="MUFI-PUA" type="codepoint">U+F110</mapping>'
            },
            diplomatic: {
               attributes: [],
               content: '',
               element: '<mapping type="diplomatic"></mapping>'
            },
            normalized: {
               attributes: [],
               content: 'H',
               element: '<mapping type="normalized">H</mapping>'
            }
         };
      </pre>
    */

   var getCurrentGlyph = function (node) {
      var sRef,
          glyphs = parsedData.getGlyphs();

      sRef = node.getAttribute('ref');
      sRef = sRef.replace('#', '');
      glyphId = sRef;

      currentGlyph = glyphs[sRef].mapping;
      return currentGlyph;
   };

   return evtGlyph;
});
