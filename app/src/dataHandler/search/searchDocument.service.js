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

   Doc.prototype.getCurrentPage = function(xmlDocDom, line) {
      var pages = $(line).xpath('.//preceding::pb/@n'),
          currentPage = pages[pages.length-1].value;
      return currentPage;

   };

   //TODO add documentation
   Doc.prototype.parsePoetry = function(xmlDocDom, currentEdition) {
      var lines = [];
      lines = Doc.prototype.parseLines(xmlDocDom, lines, currentEdition);
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
   Doc.prototype.parseLines = function(xmlDocDom, lines, currentEdition) {
      lines = Doc.prototype.getLineText(xmlDocDom, lines, currentEdition);
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
   Doc.prototype.getLineText = function(xmlDocDom, lines, currentEdition) {
      var lineNodes = [],
          line = {
             doc: [],
             page: '',
             line:'',
             text : ''
          };

      lineNodes = Doc.prototype.getLineNodes(xmlDocDom, currentEdition);

      for (var i = 0; i < lineNodes.length; i++) {
         line.doc = Doc.prototype.getCurrentDocs();
         line.page = lineNodes[i].page;
         line.line = lineNodes[i].line;
         line.text = Doc.prototype.addLineContent(lineNodes[i], line, currentEdition);
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
    * @name evtviewer.dataHandler.evtSearchDocument#getLineNodes
    * @methodOf evtviewer.dataHandler.evtSearchDocument
    *
    * @description
    * This method get line's nodes
    *
    * @param {element} xmlDocDom XML element to be parsed
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    *
    * @returns {array} return an array of line's nodes
    *
    * @author GC
    */
   Doc.prototype.getLineNodes = function(xmlDocDom, currentEdition) {
      var linesNodes = [],
          line = {},
          lineNodes = [];

      linesNodes = this.namespace ? $(xmlDocDom).xpath('//ns:body//ns:l', this.nsResolver)
                                  : $(xmlDocDom).xpath('//body//l');

      for(var i = 0; i < lineNodes.length; i++) {
         line.page = Doc.prototype.getCurrentPage(xmlDocDom, linesNodes[i]);
         line.line = $(linesNodes[i]).xpath('string(@n)')[0];

         switch (currentEdition) {
            case 'diplomatic':
               line.nodes = this.namespace ? $(linesNodes[i]).xpath('.//(ns:g | text())[not((ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex))]', this.nsResolver)
                                           : $(linesNodes[i]).xpath('.//(g | text())[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex))]');
               break;
            case 'interpretative':
               break;
            case 'critical':
               break;
         }

         lineNodes.push(line);
         line = {};
      }

      return lineNodes;
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
    * @param {array} lineNodes The line's nodes
    * @param {object} line The line object with his properties (line.line and line.nodes)
    * @param {string} currentEdition The document's current edition (diplomatic, interpretative or critical)
    *
    * @returns {str} return line's text cleaned from double spaces and some punctuation
    *
    * @author GC
    */
   Doc.prototype.addLineContent = function (lineNodes, line, currentEdition) {
      var nodes = lineNodes.nodes;

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
               break;
            case 'critical':
               break;
         }
      }

      return Utils.cleanText(line.text);
   };

   return Doc;
});
