//TODO add documentation
angular.module('evtviewer.dataHandler')
.service('evtSearchText', ['evtGlyph', 'XPATH', 'evtSearchProse', 'evtSearchPoetry', 'Utils', function Text(evtGlyph, XPATH, evtSearchProse, evtSearchPoetry, Utils) {

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
   function getText(nodes, currentEdition) {
      var text = '';
      
      for (var i = 0; i < nodes.length; i++) {
         
         switch (currentEdition) {
            case 'diplomatic':
               var currentGlyph;
               
               if (nodes[i].nodeName === 'g') {
                  currentGlyph = evtGlyph.getGlyph(nodes[i]);
                  text += evtGlyph.addGlyph(currentGlyph, currentEdition);
               }
               else {
                  text += nodes[i].textContent;
               }
               break;
            case 'interpretative':
               text += nodes[i].textContent;
               break;
            case 'critical':
               //text += criticalHandler.parseCriticalEdition(nodes[i]);
               //text += nodes[i].textContent;
               break;
         }
      }
      
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
   function getPoetryLineNodes(xmlDocDom, type, line, currentEdition, node, ns, nsResolver) {
      var nodes = [];
      
      switch (currentEdition) {
         case 'diplomatic':
            nodes = evtSearchPoetry.getDiplomaticLineNodes(node, nodes, ns, nsResolver);
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
   function getProseLineNodes(currentEdition, countLine, proseLineNodes, ns, nsResolver) {
      var nodes  = evtSearchProse.getLineNodes(countLine, proseLineNodes, ns, nsResolver);
      return nodes;
   }
   
   //TODO Add Documentation
   function getDocTitle(xmlDocDom, docs, node, ns, nsResolver) {
      var docId,
         title,
         textNode = xmlDocDom.getElementsByTagName('group')[0].children,
         currentTextNode = ns ? $(node).xpath(XPATH.ns.getCurrentTextNode, nsResolver)[0]
            : $(node).xpath(XPATH.getCurrentTextNode)[0];
      
      for (var j = 0; j < textNode.length; j++) {
         if (currentTextNode === textNode[j]) {
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
   function getCurrentDocTitle(xmlDocDom, docs, node, mainTitle, ns, nsResolver) {
      var currentTitle,
         title;
      
      currentTitle = ns ? $(node).xpath(XPATH.ns.getCurrentTitle, nsResolver)[0]
         : $(node).xpath(XPATH.getCurrentTitle)[0];
      
      if (currentTitle === '' && docs.length > 1) {
         title = getDocTitle(xmlDocDom, docs, node, ns, nsResolver);
      }
      else if (currentTitle === '' && mainTitle !== undefined) {
         title = mainTitle;
      }
      else if (currentTitle === '') {
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
   function getPoetryTitle(xmlDocDom, type, line, currentEdition, node, ns, nsResolver) {
      var title = '',
         nodes = getPoetryLineNodes(xmlDocDom, type, line, currentEdition, node, ns, nsResolver);
      
      title += getText(nodes, currentEdition/*, criticalHandler*/);
      
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
   function getLineInfo(xmlDocDom, type, nodes, docs, lines, currentEdition, ns, nsResolver) {
      console.time('getLineInfo');
   
      var line = {},
         lineNodes = [],
         currentPage,
         mainTitle,
         title,
         proseDiplomaticNodes,
         proseInterpretativeNodes,
         id = 1,
         countLine = 1;
   
      if (type === 'prose') {
         switch (currentEdition) {
            case 'diplomatic':
               proseDiplomaticNodes = ns ? $(xmlDocDom).xpath(XPATH.ns.getProseDiplomaticNodes, nsResolver)
                  : $(xmlDocDom).xpath(XPATH.getProseDiplomaticNodes);
               break;
            case 'interpretative':
               proseInterpretativeNodes = ns ? $(xmlDocDom).xpath(XPATH.ns.getProseInterpretativeNodes, nsResolver)
                  : $(xmlDocDom).xpath(XPATH.getProseInterpretativeNodes);
               break;
            case 'critical':
               break;
         }
      }
   
      for (var i = 0; i < nodes.length; i++) {
      
         if (nodes[i].nodeName === 'pb') {
            currentPage = nodes[i].getAttribute('n');
         }
         else if (nodes[i].nodeName === 'head') {
            if (nodes[i].getAttribute('type') !== 'main') {
               title = getPoetryTitle(xmlDocDom, type, line, currentEdition, nodes[i], ns, nsResolver);
               id = 1;
            }
            else {
               mainTitle = nodes[i].textContent;
            }
         }
         else {
            if (currentPage !== undefined) {
               line.page = currentPage;
            }
            if (title !== undefined) {
               line.title = title;
            }
            line.line = nodes[i].getAttribute('n') || id.toString();
            id++;
            line.doc = getCurrentDocTitle(xmlDocDom, docs, nodes[i], mainTitle, ns, nsResolver);
         
            console.time('getLineNodes');
            if (type === 'verse') {
               lineNodes = getPoetryLineNodes(xmlDocDom, type, line.line, currentEdition, nodes[i], ns, nsResolver);
            }
            else {
               switch (currentEdition) {
                  case 'diplomatic':
                     lineNodes = getProseLineNodes(currentEdition, countLine, proseDiplomaticNodes, ns, nsResolver);
                     break;
                  case 'interpretative':
                     lineNodes = getProseLineNodes(currentEdition, countLine, proseInterpretativeNodes, ns, nsResolver);
                     break;
                  case 'critical':
                     break;
               }
            
               countLine++;
            }
            console.timeEnd('getLineNodes');
         
            line.text = getText(lineNodes, currentEdition);
            lineNodes = [];
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
   function getLines(xmlDocDom, type, currentEdition, docs, ns, nsResolver) {
      var lines = [],
         nodes = ns ? $(xmlDocDom).xpath(XPATH.ns.getLineNode, nsResolver)
                    : $(xmlDocDom).xpath(XPATH.getLineNode);
      
      lines = getLineInfo(xmlDocDom, type, nodes, docs, lines, currentEdition, ns, nsResolver);
      
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
   Text.prototype.parseLines = function (xmlDocDom, lines, type, currentEdition, docs, ns, nsResolver) {
      lines = getLines(xmlDocDom, type, currentEdition, docs, ns, nsResolver);
      return lines;
   };
   
   /*function getParagraphs(xmlDocDom, currentEdition, docs, ns, nsResolver) {
	  
	  var lines = [],
		 nodes = ns ? $(xmlDocDom).xpath('//ns:body//(ns:pb|ns:p//ns:lb)', nsResolver)
			: $(xmlDocDom).xpath('//body//p');
	  
	  lines = getParInfo(xmlDocDom, nodes, docs, lines, currentEdition, /!*criticalHandler,*!/ ns, nsResolver);
	  
	  
	  return lines;
   }*/
   /*Text.prototype.parseParagraphs = function() {
	  lines = getParagraphs(xmlDocDom, currentEdition, docs, ns, nsResolver);
	  return lines;
   };*/
   
}]);
