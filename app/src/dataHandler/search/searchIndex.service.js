var lunr = require('lunr');

angular.module('evtviewer.dataHandler')
   .service('evtSearchIndex', function Index() {
      this.index = {};
      
      Index.prototype.createIndex = function (parsedElementsForIndexing) {
         console.time('INDEX');
         var document;
         this.index = lunr(function () {
            this.pipeline.remove(lunr.trimmer);
            this.pipeline.remove(lunr.stemmer);
            this.pipeline.remove(lunr.stopWordFilter);
            
            this.ref('xmlDocId');
            this.field('diplomaticText');
            this.field('interpretativeText');
            this.use(addDocTitleMetadata, parsedElementsForIndexing);
            this.use(addDocIdMetadata, parsedElementsForIndexing);
            this.use(addParagraphMetadata, parsedElementsForIndexing);
            this.use(addPageMetadata, parsedElementsForIndexing);
            this.use(addPageIdMetadata, parsedElementsForIndexing);
            this.use(addLineMetadata, parsedElementsForIndexing);
            this.use(addLineIdMetadata, parsedElementsForIndexing);
            
            for (var i in parsedElementsForIndexing) {
               document = map(parsedElementsForIndexing[i]);
               this.add(document);
            }
         });
         console.timeEnd('INDEX');
         return this.index;
      };
      
      Index.prototype.getIndex = function () {
         return this.index;
      };
      
      // serve per dire all'indice dove si trovano i campi nella mia struttura
      function map(xmlDoc) {
         var document = {
            xmlDocId: xmlDoc.xmlDocId,
            diplomaticText: xmlDoc.content.diplomatic,
            interpretativeText: xmlDoc.content.interpretative
         };
         return document;
      }
      
      function addDocTitleMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            token.metadata['xmlDocTitle'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].xmlDocTitle;
            
            return token;
         };
         
         lunr.Pipeline.registerFunction(pipelineFunction, 'xmlDocTitle');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('xmlDocTitle');
      }
      
      function addDocIdMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            token.metadata['xmlDocId'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].xmlDocId;
            
            return token;
         };
         
         lunr.Pipeline.registerFunction(pipelineFunction, 'xmlDocId');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('xmlDocId');
      }
      
      function addParagraphMetadata(builder, parsedElementsForIndexing) {
         var docIndex = 0;
         var pipelineFunction = function (token) {
            docIndex = builder.documentCount - 1;
            token.metadata['paragraph'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].par;
            return token;
         };
         
         if(parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].par !== undefined) {
            lunr.Pipeline.registerFunction(pipelineFunction, 'paragraph');
            builder.pipeline.add(pipelineFunction);
            builder.metadataWhitelist.push('paragraph');
         }
      }
      
      function addPageMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            token.metadata['page'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].page;
            return token;
         };
         
         lunr.Pipeline.registerFunction(pipelineFunction, 'page');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('page');
      }
      
      function addPageIdMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            token.metadata['pageId'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].pageId;
            return token;
         };
         
         lunr.Pipeline.registerFunction(pipelineFunction, 'pageId');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('pageId');
      }
      
      function addLineMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            token.metadata['line'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].line;
            return token;
         };
         
         lunr.Pipeline.registerFunction(pipelineFunction, 'line');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('line');
      }
      
      function addLineIdMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            token.metadata['lineId'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].lineId;
            return token;
         };
         
         lunr.Pipeline.registerFunction(pipelineFunction, 'lineId');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('lineId');
      }
   });
