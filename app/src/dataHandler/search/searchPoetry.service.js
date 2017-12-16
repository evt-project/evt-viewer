/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtSearchPoetry
 *
 * @description
 * # evtSearchDocument
 * In this service are defined and exposed methods to parse poetic Documents
 *
 * @requires evtviewer.dataHandler.evtBuilder
 * @requires evtviewer.dataHandler.evtGlyph
 * @requires evtviewer.dataHandler.parseData
 * @requires evtviewer.core.Utils
 */
angular.module('evtviewer.dataHandler')

.factory('evtSearchPoetry', function(evtBuilder, evtGlyph, Utils) {
   //Poetry constructor
   function Poetry() {}

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#parseLines
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method parses document's lines
    *
    * @param {element} xmlDocDom XML element to be parsed
    * @param {array} lines Parsed lines
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    * @param {array} docs The document's title
    * @param {boolean} ns True if namespace exist
    * @param {function} nsResolver If exist it resolves the namespace
    *
    * @returns {array} return an array of parsed lines
    *
    * @author GC
    */
   Poetry.prototype.parseLines = function(xmlDocDom, lines, currentEdition, docs, ns, nsResolver) {
      lines = Poetry.prototype.getLines(xmlDocDom, currentEdition, docs, ns, nsResolver);
      return lines;
   };

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getLine
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get line's number, page number, text and some information about lines
    *
    * @param {element} xmlDocDom XML element to be parsed
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    * @param {array} docs The document's title
    * @param {boolean} ns True if namespace exist
    * @param {function} nsResolver If exist it resolves the namespace
    *
    * @returns {array} return an array of parsed lines. The structure is:
    * <pre>
    *     var lines = [
    *       0: {
    *          doc:[],
    *          line:'',
    *          page:'',
    *          poetry:'',
    *          text:''
    *       },
    *       1: {
    *          doc:[],
    *          line:'',
    *          page:'',
    *          poetry:'',
    *          text:''
    *       }
    *     ]
    * </pre>
    * @author GC
    */
   Poetry.prototype.getLines = function(xmlDocDom, currentEdition, docs, ns, nsResolver) {
      var lines = [],
         nodes = ns ? $(xmlDocDom).xpath('//ns:body//(ns:l|ns:pb|ns:head[@type="sub"])[not(ancestor::ns:note)]', nsResolver)
                    : $(xmlDocDom).xpath('//body//(l|pb|head[@type="sub"])[not(ancestor::note)]');

      lines = Poetry.prototype.getLineInfo(nodes, docs, lines, currentEdition, ns, nsResolver);

      return lines;
   };

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getLineInfo
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get line's number, page number, text and some information about line
    *
    * @param {array} nodes Line's nodes
    * @param {array} docs The document's title
    * @param {array} lines An empty array
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    * @param {boolean} ns True if namespace exist
    * @param {function} nsResolver If exist it resolves the namespace
    *
    * @returns {array} return an array of parsed lines.
    *
    * @author GC
    */
   Poetry.prototype.getLineInfo = function(nodes, docs, lines, currentEdition, ns, nsResolver) {
      var line = {},
         currentPage,
         id,
         title;

      for(var i = 0; i < nodes.length; i++) {

         if(nodes[i].nodeName === 'pb') {
            currentPage = nodes[i].getAttribute('n');
         }
         else if(nodes[i].nodeName === 'head') {
            title = Poetry.prototype.getPoetryTitle(currentEdition, nodes[i], ns, nsResolver);
            id = 1;
         }
         else {
            line.doc = docs;
            line.poetry = title;
            line.page = currentPage;
            line.line = nodes[i].getAttribute('n') || id; id++;

            var children = Poetry.prototype.getChildNodes(currentEdition, nodes[i], ns, nsResolver);
            line.text = Poetry.prototype.getText(children, currentEdition);

            lines.push(line);
         }
         line = {};
      }
      return lines;
   }

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getPoetryTitle
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get the title of a specific poem
    *
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    * @param {element} node The line's node
    * @param {boolean} ns True if namespace exist
    * @param {function} nsResolver If exist it resolves the namespace
    *
    * @returns {str} return the poem's title
    *
    * @author GC
    */
   Poetry.prototype.getPoetryTitle = function (currentEdition, node, ns, nsResolver) {
      var text = '',
         nodes = Poetry.prototype.getChildNodes(currentEdition, node, ns, nsResolver);

      text += Poetry.prototype.getText(nodes, currentEdition);

      return text;
   };

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getChildNodes
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get child nodes of specific line node
    *
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    * @param {element} node The line's node
    * @param {boolean} ns True if namespace exist
    * @param {function} nsResolver If exist it resolves the namespace
    *
    * @returns {array} return and array of child nodes
    *
    * @author GC
    */
   Poetry.prototype.getChildNodes = function(currentEdition, node, ns, nsResolver) {
      var nodes = [];

      switch (currentEdition) {
         case 'diplomatic':
            nodes = ns ? $(node).xpath('.//(ns:g | text())[not((ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex|ancestor::ns:note))]', nsResolver)
                       : $(node).xpath('.//(g | text())[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex|ancestor::note))]');
            break;
         case 'interpretative':
            nodes = ns ? $(node).xpath('.//(ns:g | text())[not((ancestor::ns:sic|ancestor::ns:orig|ancestor::ns:abbr|ancestor::ns:am|ancestor::ns:note))]', nsResolver)
                       : $(node).xpath('.//(g | text())[not((ancestor::sic|ancestor::orig|ancestor::abbr|ancestor::am|ancestor::note))]');
            break;
         case 'critical':
            break;
      }

      return nodes;
   };

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getText
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get and add line's text to an object
    *
    * @param {array} nodes An array of line's child nodes
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    *
    * @returns {str} return line's text cleaned from double spaces and some punctuation
    *
    * @author GC
    */
   Poetry.prototype.getText = function (nodes, currentEdition) {
      var text = '';

      for(var i = 0; i < nodes.length; i++) {

         switch(currentEdition) {
            case 'diplomatic':
               var glyph,
                  currentGlyph;

               if(nodes[i].nodeName === 'g') {
                  glyph = evtBuilder.create(evtGlyph, 'Glyph');
                  currentGlyph = glyph.getGlyph(nodes[i]);
                  text += glyph.addGlyph(currentGlyph, currentEdition);
               }
               else {
                  text += nodes[i].textContent;
               }
               break;
            case 'interpretative':
               text += nodes[i].textContent;
               break;
            case 'critical':
               break;
         }
      }

      return Utils.cleanText(text);
   };

   return Poetry;
});
