//TODO add documentation
angular.module('evtviewer.dataHandler')
.service('evtSearchText', ['evtGlyph', 'XPATH', 'evtSearchProse', 'evtSearchPoem', 'Utils', function Text(evtGlyph, XPATH, evtSearchProse, evtSearchPoem, Utils) {

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
   function getText(nodes, editionType) {
      var text = '';
      
      for (var i = 0; i < nodes.length; i++) {
         var currentGlyph;
   
         if (nodes[i].nodeName === 'g') {
            currentGlyph = evtGlyph.getGlyph(nodes[i]);
            text += evtGlyph.addGlyph(currentGlyph, editionType);
         }
         else {
            text += nodes[i].textContent;
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
   function getPoemLineNodes(xmlDocDom, type, line, node, ns, nsResolver) {
      var nodes = [];
      
      nodes.diplomatic = evtSearchPoem.getDiplomaticLineNodes(node, nodes, ns, nsResolver);
      nodes.interpretative = evtSearchPoem.getInterpretativeLineNodes(node, nodes, ns, nsResolver);
      
      return nodes;
   }
   
   //TODO Add Documentation
   function getProseLineNodes(countLine, proseLineNodes, ns, nsResolver) {
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
   function getPoemTitle(xmlDocDom, type, line, node, ns, nsResolver) {
      var title = {
         diplomatic: '',
         interpretative: ''
         },
         nodes = getPoemLineNodes(xmlDocDom, type, line, node, ns, nsResolver);
      
      title.diplomatic = getText(nodes.diplomatic, 'diplomatic');
      title.interpretative = getText(nodes.interpretative, 'interpretative');
      
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
   function getLineInfo(xmlDocDom, type, nodes, docs, lines, ns, nsResolver) {
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
   
      if(type === 'prose') {
         console.time('getDiplomaticNodes');
         proseDiplomaticNodes = ns ? $(xmlDocDom).xpath(XPATH.ns.getProseDiplomaticNodes, nsResolver)
                                   : $(xmlDocDom).xpath(XPATH.getProseDiplomaticNodes);
         console.timeEnd('getDiplomaticNodes');
         
         console.time('getInterpretativeNodes');
         proseInterpretativeNodes = ns ? $(xmlDocDom).xpath(XPATH.ns.getProseInterpretativeNodes, nsResolver)
                                       : $(xmlDocDom).xpath(XPATH.getProseInterpretativeNodes);
         console.timeEnd('getInterpretativeNodes');
      }
   
      for (var i = 0; i < nodes.length; i++) {
      
         if (nodes[i].nodeName === 'pb') {
            currentPage = nodes[i].getAttribute('n');
         }
         else if (nodes[i].nodeName === 'head') {
            if (nodes[i].getAttribute('type') !== 'main') {
               title = getPoemTitle(xmlDocDom, type, line, nodes[i], ns, nsResolver);
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
               lineNodes = getPoemLineNodes(xmlDocDom, type, line.line, nodes[i], ns, nsResolver);
            }
            else {
               lineNodes.diplomatic = getProseLineNodes(countLine, proseDiplomaticNodes, ns, nsResolver);
               lineNodes.interpretative = getProseLineNodes(countLine, proseInterpretativeNodes, ns, nsResolver);
               countLine++;
            }
            console.timeEnd('getLineNodes');
         
            line.text = {
               diplomatic: getText(lineNodes.diplomatic, 'diplomatic'),
               interpretative: getText(lineNodes.interpretative, 'interpretative')
            }
            
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
    *          poem:'',
    *          text:''
    *       },
    *       1: {
    *          doc:[],
    *          line:'',
    *          page:'',
    *          poem:'',
    *          text:''
    *       }
    *     ]
    * </pre>
    * @author GC
    */
   function getLines(xmlDocDom, type, docs, ns, nsResolver) {
      var lines = [];
      
      /*console.time('GET-LINE-NODES');
      var nodes = ns ? $(xmlDocDom).xpath(XPATH.ns.getLineNode, nsResolver)
                    : $(xmlDocDom).xpath(XPATH.getLineNode);
      console.timeEnd('GET-LINE-NODES');*/
   
      console.time('GET-LINE-NODES');
      var nodes = xmlDocDom.querySelectorAll('pb,lb,l,head,head[type=\'sub\']');
      for (var i = 0; i < nodes.length; i++) {
         var haveParentNote = $(nodes[i]).parents().is('note');
         if(haveParentNote) {
            var parent = nodes[i].parentNode;
            parent.removeChild(nodes[i]);
            nodes = xmlDocDom.querySelectorAll('pb,lb,l,head,head[type=\'sub\']');
            i = i-1;
         }
      }
      console.timeEnd('GET-LINE-NODES');
      
      lines = getLineInfo(xmlDocDom, type, nodes, docs, lines, ns, nsResolver);
      
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
   Text.prototype.parseLines = function (xmlDocDom, lines, type, docs, ns, nsResolver) {
      lines = getLines(xmlDocDom, type, docs, ns, nsResolver);
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
