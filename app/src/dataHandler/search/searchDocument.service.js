import 'jquery-xpath/jquery.xpath.js';

/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtSearchDocument
 *
 * @description
 * # evtSearchDocument
 * In this service are defined and exposed methods to parse Document
 *
 * @requires evtviewer.dataHandler.evtBuilder
 * @requires evtviewer.dataHandler.evtGlyph
 * @requires evtviewer.dataHandler.parseData
 * @requires evtviewer.core.Utils
 */
angular.module('evtviewer.dataHandler')

.factory('evtSearchDocument', function(evtBuilder, evtGlyph, parsedData, Utils) {
   //Doc constructor
   function Doc() {
      this.namespace = false;
      this.nsResolver = '';
      this.title = '';
   }

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#hasNamespace
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method check if XML document has a namespace
    *
    * @param {element} xmlDocDom XML element to be parsed
    *
    * @returns {boolean} return false if the document hasn't a namespace
    *
    * @author GC
    */
   Doc.prototype.hasNamespace = function(xmlDocDom) {
      var ns = xmlDocDom.documentElement.namespaceURI;
      if(ns !== null) {
         this.namespace = true;
         this.nsResolver = function(prefix) {
            if(prefix === 'ns') {
               return xmlDocDom.documentElement.namespaceURI;
            }
         };
      }
      return this.namespace;
   };

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getCurrentDocs
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get the title the currents docs
    *
    * @returns {array} return a collection of docs
    *
    * @author GC
    */
   Doc.prototype.getCurrentDocs = function() {
      var documents = parsedData.getDocuments(),
          docIndexes = documents._indexes,
          docId,
          document,
          docs = [],
          doc = {};

      for(var i = 0; i < docIndexes.length; i++) {
         docId = docIndexes[i];
         document = documents[docId];
         doc.title = document.title;
         docs.push(doc);
         doc = {};
      }

      return docs;
   };

   //TODO add documentation
   Doc.prototype.parsePoetry = function(xmlDocDom, currentEdition, ns, nsResolver) {
      var lines = [];
      lines = Doc.prototype.parseLines(xmlDocDom, lines, currentEdition, ns, nsResolver);
      console.log(lines);
   };

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
    *
    * @returns {array} return an array of parsed lines
    *
    * @author GC
    */
   Doc.prototype.parseLines = function(xmlDocDom, lines, currentEdition, ns, nsResolver) {
      lines = Doc.prototype.getLineText(xmlDocDom, lines, currentEdition, ns, nsResolver);
      return lines;
   };

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getLineText
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get line's number and text
    *
    * @param {element} xmlDocDom XML element to be parsed
    * @param {array} lines Parsed lines
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    *
    * @returns {array} return an array of parsed lines
    *
    * @author GC
    */
   Doc.prototype.getLineText = function(xmlDocDom, lines, currentEdition, ns, nsResolver) {
      var lineInfo = [],
          line = {
             doc: [],
             page: '',
             line:'',
             text : ''
          };

      console.time('getLineInfo');
      lineInfo = Doc.prototype.getLinesInfo(xmlDocDom, currentEdition, ns, nsResolver);
      console.timeEnd('getLineInfo');

      for (var i = 0; i < lineInfo.length; i++) {
         line.doc = Doc.prototype.getCurrentDocs();
         line.page = lineInfo[i].page;
         line.line = lineInfo[i].line;
         line.text = Doc.prototype.addLineContent(lineInfo[i], line, currentEdition);
         lines.push(line);
         line = {
            doc: [],
            page: '',
            line:'',
            text : ''
         };
      }
      return lines;
   };

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#getLinesInfo
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get some information about the line:
    * - the nodes within a line
    * - the line number
    * - the page number where the line is located
    *
    * @param {element} xmlDocDom XML element to be parsed
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    *
    * @returns {array} return an array of objects containing information about the lines
    *
    * @author GC
    */
   Doc.prototype.getLinesInfo = function(xmlDocDom, currentEdition, ns, nsResolver) {
      var linesNodes,
          line = {},
          linesInfo = [],
          currentPage;

      linesNodes = ns ? $(xmlDocDom).xpath('//ns:body//(ns:l|ns:pb)', nsResolver)
                      : $(xmlDocDom).xpath('//body//(l|pb)');

      for(var i = 0; i < linesNodes.length; i++) {
         if(linesNodes[i].nodeName === 'pb') {
            currentPage = linesNodes[i].getAttribute('n');
         }
         else {
            line.page = currentPage;
            line.line = $(linesNodes[i]).xpath('string(@n)')[0];

            switch (currentEdition) {
               case 'diplomatic':
                  line.nodes = ns ? $(linesNodes[i]).xpath('.//(ns:g | text())[not((ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex|ancestor::ns:note))]', nsResolver)
                                  : $(linesNodes[i]).xpath('.//(g | text())[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex|ancestor::note))]');
                  break;
               case 'interpretative':
                  line.nodes = ns ? $(linesNodes[i]).xpath('.//(ns:g | text())[not((ancestor::ns:sic|ancestor::ns:orig|ancestor::ns:abbr|ancestor::ns:am|ancestor::ns:note))]', nsResolver)
                                  : $(linesNodes[i]).xpath('.//(g | text())[not((ancestor::sic|ancestor::orig|ancestor::abbr|ancestor::am|ancestor::note))]');
                  break;
               case 'critical':
                  break;
            }

            linesInfo.push(line);
            line = {};
         }
      }

      return linesInfo;
   };

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtSearchDocument#addLineContent
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method add line's content to an object
    *
    * @param {object} lineInfo An object containing information about the current line
    * @param {object} line The line object with his properties (line.line and line.nodes)
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    *
    * @returns {str} return line's text cleaned from double spaces and some punctuation
    *
    * @author GC
    */
   Doc.prototype.addLineContent = function (lineInfo, line, currentEdition) {
      var nodes = lineInfo.nodes;

      for(var i = 0; i < nodes.length; i++) {

         switch(currentEdition) {
            case 'diplomatic':
               var glyph,
                   currentGlyph;

               if(nodes[i].nodeName === 'g') {
                  glyph = evtBuilder.create(evtGlyph, 'Glyph');
                  currentGlyph = glyph.getGlyph(nodes[i]);
                  line.text += glyph.addGlyph(currentGlyph, currentEdition);
               }
               else {
                  line.text += nodes[i].textContent;
               }
               break;
            case 'interpretative':
               line.text += nodes[i].textContent;
               break;
            case 'critical':
               break;
         }
      }

      return Utils.cleanText(line.text);
   };

   return Doc;
});
