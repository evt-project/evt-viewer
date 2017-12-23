import 'jquery-xpath/jquery.xpath.js';
var lunr = require('lunr');

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

.factory('evtSearchDocument', function(evtBuilder, evtSearchPoetry, evtCriticalEditionHandler, parsedData) {
   //Doc constructor
   function Doc() {
      this.namespace = false;
      this.nsResolver = '';
      this.title = '';
   }

   Doc.Poetry = evtSearchPoetry;
   //Doc.Prose = evtSearchProse;

   Doc.CriticalEditionHandler = evtCriticalEditionHandler;

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
   function getCurrentDocs() {
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
   }

   //TODO add documentation
   Doc.prototype.parsePoetry = function(xmlDocDom, currentEdition, ns, nsResolver) {
      var docs = getCurrentDocs();
      var poetry = evtBuilder.create(Doc, 'Poetry');
      var criticalHandler = evtBuilder.create(Doc, 'CriticalEditionHandler');
      var lines = [];
      lines = poetry.parseLines(xmlDocDom, lines, currentEdition, criticalHandler, docs, ns, nsResolver);

      var docPos = 0;

      var lineMetadata = function (builder) {
         var pipelineFunction = function (token) {
            var line = lines[docPos].line;
            token.metadata['line'] = line;

            return token;
         };
         lunr.Pipeline.registerFunction(pipelineFunction, 'line');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('line');
      };

      var pageMetadata = function (builder) {
         var pipelineFunction = function (token) {
            var page = lines[docPos].page;
            token.metadata['page'] = page;

            return token;
         };
         lunr.Pipeline.registerFunction(pipelineFunction, 'page');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('page');
      };

      var poetryMetadata = function (builder) {
         var pipelineFunction = function (token) {
            var poetry = lines[docPos].poetry;
            token.metadata['poetry'] = poetry;

            return token;
         };
         lunr.Pipeline.registerFunction(pipelineFunction, 'poetry');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('poetry');
      };

      var idx = lunr(function () {
         this.ref('doc')
         this.field('text')
         this.use(lineMetadata);
         this.use(pageMetadata);
         this.use(poetryMetadata);
         this.metadataWhitelist = ['position', 'line', 'page', 'poetry'];

         for(var i in lines) {
            this.add(lines[i]);
            docPos++;
         }
      });


      var res = idx.search('giulia');

      console.log(lines);
   };

   return Doc;
});
