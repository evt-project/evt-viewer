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

.factory('evtSearchPoetry', function(evtBuilder, evtGlyph, parsedData, Utils, XPATH) {
   //Poetry constructor
   function Poetry() {}

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
   function getText(nodes, currentEdition, criticalHandler) {
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
               text += criticalHandler.parseCriticalEdition(nodes[i]);
               //text += nodes[i].textContent;
               break;
         }
      }
      /*console.log(Utils.cleanText(text));*/
      return Utils.cleanText(text);
   }

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
   function getChildNodes(currentEdition, node, ns, nsResolver) {
      var nodes = [];

      switch (currentEdition) {
         case 'diplomatic':
            nodes = ns ? $(node).xpath(XPATH.ns.getDiplomaticChildNodes, nsResolver)
               : $(node).xpath(XPATH.getDiplomaticChildNodes);
            break;
         case 'interpretative':
            nodes = ns ? $(node).xpath(XPATH.ns.getInterpretativeChildNodes, nsResolver)
               : $(node).xpath(XPATH.getInterpretativeChildNodes);
            break;
         case 'critical':
            nodes = ns ? $(node).xpath(XPATH.ns.getCriticalChildNodes, nsResolver)
               : $(node).xpath(XPATH.getCriticalChildNodes);
            break;
      }

      return nodes;
   }

   //TODO Add Documentation
   function getDocsTitle(xmlDocDom, docs,  node, ns, nsResolver) {
      var docId,
         title,
         textNode = xmlDocDom.getElementsByTagName('group')[0].children,
         currentTextNode = ns ? $(node).xpath(XPATH.ns.getCurrentTextNode, nsResolver)[0]
            : $(node).xpath(XPATH.getCurrentTextNode)[0];

      for(var j = 0; j < textNode.length; j++) {
         if(currentTextNode === textNode[j]) {
            docId = j;
            title = docs[j].title;
         }
      }
      return title;
   }

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getDocTitle
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get the doc's title
    *
    * @param {element} xmlDocDom XML element to be parsed
    * @param {array} docs The document's title
    * @param {element} node The current line node
    * @param {boolean} ns True if namespace exist
    * @param {function} nsResolver If exist it resolves the namespace
    *
    * @returns {array} return an array with lines info.
    *
    * @author GC
    */
   function getDocTitle(xmlDocDom, docs, node, mainTitle, ns, nsResolver) {
      var currentTitle,
         title;

      currentTitle = ns ? $(node).xpath(XPATH.ns.getCurrentTitle, nsResolver)[0]
         : $(node).xpath(XPATH.getCurrentTitle)[0];

      if(currentTitle === '' && docs.length > 1) {
         title = getDocsTitle(xmlDocDom, docs,  node, ns, nsResolver);
      }
      else if(currentTitle === '' && mainTitle !== undefined) {
         title = mainTitle;
      }
      else if(currentTitle === '') {
         title = docs[0].title;
      }
      else {
         for (var i = 0; i < docs.length; i++) {
            if (currentTitle === docs[i].title) {
               title = docs[i].title;
            }
         }
      }
      return title;
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
   function getPoetryTitle(currentEdition, node, criticalHandler, ns, nsResolver) {
      var title = '',
         nodes = getChildNodes(currentEdition, node, ns, nsResolver);

      title += getText(nodes, currentEdition, criticalHandler);

      return title;
   }

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getLineInfo
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get line's number, page number, text and some information about line
    *
    * @param {element} xmlDocDom XML element to be parsed
    * @param {array} nodes Line's nodes
    * @param {array} docs The document's title
    * @param {array} lines An empty array
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    * @param {boolean} ns True if namespace exist
    * @param {function} nsResolver If exist it resolves the namespace
    *
    * @returns {array} return an array with lines info.
    *
    * @author GC
    */
   function getLineInfo(xmlDocDom, nodes, docs, lines, currentEdition, criticalHandler, ns, nsResolver) {
      console.time('getLineInfo');
      var line = {},
         currentPage,
         id = 1,
         mainTitle,
         title;

      for(var i = 0; i < nodes.length; i++) {

         if(nodes[i].nodeName === 'pb') {
            currentPage = nodes[i].getAttribute('n');
         }
         else if(nodes[i].nodeName === 'head') {
            if(nodes[i].getAttribute('type') !== 'main') {
               title = getPoetryTitle(currentEdition, nodes[i],criticalHandler, ns, nsResolver);
               id = 1;
            }
            else {
               mainTitle = nodes[i].textContent;
            }
         }
         else {
            if(currentPage !== undefined) {
               line.page = currentPage;
            }
            if(title !== undefined) {
               line.poetry = title;
            }
            line.line = nodes[i].getAttribute('n') || id.toString(); id++;
            line.doc = getDocTitle(xmlDocDom, docs, nodes[i], mainTitle, ns, nsResolver);

            var children = getChildNodes(currentEdition, nodes[i], ns, nsResolver);
            line.text = getText(children, currentEdition, criticalHandler);

            lines.push(line);
         }
         line = {};
      }
      console.timeEnd('getLineInfo');
      return lines;
   }

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
   function getLines(xmlDocDom, currentEdition, criticalHandler, docs, ns, nsResolver) {
      console.time('getLines');
      var lines = [],
         nodes = ns ? $(xmlDocDom).xpath(XPATH.ns.getLineNode, nsResolver)
                    : $(xmlDocDom).xpath(XPATH.getLineNode);

      lines = getLineInfo(xmlDocDom, nodes, docs, lines, currentEdition, criticalHandler, ns, nsResolver);
      console.timeEnd('getLines');

      return lines;
   }

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
   Poetry.prototype.parseLines = function(xmlDocDom, lines, currentEdition, criticalHandler, docs, ns, nsResolver) {
      lines = getLines(xmlDocDom, currentEdition, criticalHandler, docs, ns, nsResolver);
      return lines;
   };

   return Poetry;
});
