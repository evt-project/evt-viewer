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

.service('evtSearchDocument', ['evtSearchPoem', 'evtSearchProse', 'evtSearchText', 'parsedData', function Doc(evtSearchPoem, evtSearchProse, evtSearchText, parsedData) {
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
   Doc.prototype.getDocsTitle = function() {
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
   };

   //TODO add documentation
   function getDocType(xmlDocDomBody) {
      var type = '',
         poem = xmlDocDomBody.getElementsByTagName('l').length !== 0,
         prose = xmlDocDomBody.getElementsByTagName('l').length === 0;
      
      if(poem) {
         type = 'verse';
      }
      else if(prose) {
         type = 'prose';
      }

      return type;
   }
   
   Doc.prototype.parseText = function(xmlDocDom, currentEdition, docs, ns, nsResolver) {
      var xmlDocDomBody = xmlDocDom.getElementsByTagName('body'),
         hasLineBreakTag,
         docLines = [],
         lines= [];
   
      for(var i = 0; i < xmlDocDomBody.length; i++) {
         hasLineBreakTag = $(xmlDocDomBody[i]).find('lb').length !== 0;
         this.type = getDocType(xmlDocDomBody[i]);
   
         if (currentEdition === 'diplomatic') {
            if (hasLineBreakTag === true) {
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
                     //parse line <l>
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
      //console.log('# PARAGRAPHS #', paragraphs);
      
      return lines;
   };
   
}]);
