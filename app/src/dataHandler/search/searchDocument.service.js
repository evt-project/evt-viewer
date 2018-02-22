/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.search.evtSearchDocument
 *
 * @description
 * # evtSearchDocument
 * In this service are defined and exposed methods to parse Document
 *
 * @requires evtviewer.dataHandler.search.evtSearchPoetry
 * @requires evtviewer.dataHandler.parsedData
 */
angular.module('evtviewer.dataHandler')

.service('evtSearchDocument', ['evtSearchText', 'parsedData', function Doc(evtSearchText, parsedData) {
   this.ns = false;
   this.nsResolver = '';
   this.Text = evtSearchText;
   this.type = '';
   this.edition = '';
   
   var prevDocsLinesNumber = 0;

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.search.evtSearchDocument#hasNamespace
    * @methodOf evtviewer.dataHandler.search.evtSearchDocument
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
         this.ns = true;
         this.nsResolver = function(prefix) {
            if(prefix === 'ns') {
               return xmlDocDom.documentElement.namespaceURI;
            }
         };
      }
      return this.ns;
   };

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.search.evtSearchDocument#getCurrentDocs
    * @methodOf evtviewer.dataHandler.search.evtSearchDocument
    *
    * @description
    * This method get the title the currents docs
    *
    * @returns {array} return a collection of docs
    *
    * @author GC
    */
   function getDocsTitle() {
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
         doc.id  = docId;
         docs.push(doc);
         doc = {};
      }

      return docs;
   }

   //TODO add documentation
   function getDocType(xmlDocDomBody) {
      var poem = xmlDocDomBody.getElementsByTagName('l').length !== 0,
         prose = xmlDocDomBody.getElementsByTagName('l').length === 0;
      
      if(poem === true) {
         this.type = 'verse';
      }
      else if(prose === true) {
         this.type = 'prose';
      }
   }
   
   Doc.prototype.parseText = function(xmlDocDom, currentEdition, ns, nsResolver) {
      var xmlDocDomBody = xmlDocDom.getElementsByTagName('body'),
         docs = getDocsTitle(),
         docHasLineBreakTag,
         docLines = [],
         lines = [];
   
      for(var i = 0; i < xmlDocDomBody.length; i++) {
         docHasLineBreakTag = $(xmlDocDomBody[i]).find('lb').length !== 0;
         getDocType(xmlDocDomBody[i]);
   
         if (currentEdition === 'diplomatic') {
            if (docHasLineBreakTag === true) {
               docLines = this.Text.parseLines(xmlDocDom, xmlDocDomBody[i], prevDocsLinesNumber, docs, ns, nsResolver);
               prevDocsLinesNumber = this.Text.getAllDocsLinesNumber();
               lines = Object.assign(lines, docLines);
            }
            else {
               switch (this.type) {
                  case 'prose':
                     console.log('Parse Paragraph!');
                     //parse Paragraph
                     break;
                  case 'verse':
                     console.log('Parse verse!');
                     //parse Verse
                     lines = this.Text.parseVerse();
                     break;
               }
            }
         }
         else {
            console.log('Parse critical edition!');
            //parse critical edition
         }
      }
      
      console.log('# LINES #', lines);
      return lines;
   };
   
}]);
