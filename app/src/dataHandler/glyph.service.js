angular.module('evtviewer.dataHandler')

.service('evtGlyph', function(parsedData, evtInterface) {
   var evtGlyph =  {};

   var currentGlyph,
       glyphId,
       glyphs = [];

   /* *************************** */
   /* BEGIN getGlyph(node)        */
   /* *************************** */
   evtGlyph.getGlyph = function (node) {
      var glyph = {};

      currentGlyph = getCurrentGlyph(node);

      glyph.id = glyphId;
      currentGlyph.diplomatic !== undefined ? glyph.diplomatic = currentGlyph.diplomatic.content : glyph.diplomatic = '';
      currentGlyph.normalized !== undefined ? glyph.interpretative = currentGlyph.normalized.content: glyph.interpretative = '';

      return glyph;
   };

   /* *************************** */
   /* BEGIN getGlyph(node)        */
   /* *************************** */
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

   /* **************************** */
   /* BEGIN addGlyph(currentGlyph) */
   /* *************************************************** */
   /* Function to add the current glyph in text (string)  */
   /* @currentGlyph -> current glyph                      */
   /* *************************************************** */
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

   /* **************************************************************** */
   /* BEGIN replaceGlyphTag(childNode, innerHtml, innerHtmlChild, doc) */
   /* **************************************************************** */
   /* Function to replace current glyph tag with glyph   */
   /* @childNode -> current childNode                    */
   /* @innerHtml -> code in which replace outerHtmlChild */
   /* @outerHtmlChild -> code to replace in innerHtml    */
   /* @doc -> current xml doc                            */
   /* ************************************************** */
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
