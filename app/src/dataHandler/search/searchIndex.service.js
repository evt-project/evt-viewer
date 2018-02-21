var lunr = require('lunr');

angular.module('evtviewer.dataHandler')

.service('evtSearchIndex', function Index() {
   this.index = [];
   
   function map(doc) {
      var document = {
         doc: doc.doc,
         page: doc.page,
         line: doc.line,
         diplomaticText: doc.text.diplomatic,
         interpretativeText: doc.text.interpretative
      };
      return document;
   }
   
   function addLineMetadata(builder, parsedDocs) {
      
      var pipelineFunction = function(token) {
         var docIndex = builder.documentCount - 1;
         token.metadata['line'] = parsedDocs[Object.keys(parsedDocs)[docIndex]].line;
         return token;
      };
      
      lunr.Pipeline.registerFunction(pipelineFunction, 'line');
      builder.pipeline.add(pipelineFunction);
      builder.metadataWhitelist.push('line');
   }
   
   function addLineIdMetadata(builder, parsedDocs) {
      var pipelineFunction = function(token) {
         var docIndex = builder.documentCount - 1;
         token.metadata['lineId'] = parsedDocs[Object.keys(parsedDocs)[docIndex]].lineId;
         return token;
      };
      
      lunr.Pipeline.registerFunction(pipelineFunction, 'lineId');
      builder.pipeline.add(pipelineFunction);
      builder.metadataWhitelist.push('lineId');
   }
   
   function addPageMetadata(builder, parsedDocs) {
      var pipelineFunction = function(token) {
         var docIndex = builder.documentCount - 1;
         token.metadata['page'] = parsedDocs[Object.keys(parsedDocs)[docIndex]].page;
         return token;
      };
      
      lunr.Pipeline.registerFunction(pipelineFunction, 'page');
      builder.pipeline.add(pipelineFunction);
      builder.metadataWhitelist.push('page');
   }
   
   function addPageIdMetadata(builder, parsedDocs) {
      var pipelineFunction = function(token) {
         var docIndex = builder.documentCount - 1;
         token.metadata['pageId'] = parsedDocs[Object.keys(parsedDocs)[docIndex]].pageId;
         return token;
      };
      
      lunr.Pipeline.registerFunction(pipelineFunction, 'pageId');
      builder.pipeline.add(pipelineFunction);
      builder.metadataWhitelist.push('pageId');
   }
   
   function addParagraphMetadata(builder, parsedDocs) {
      var pipelineFunction = function(token) {
         var docIndex = builder.documentCount - 1;
         token.metadata['paragraph'] = parsedDocs[Object.keys(parsedDocs)[docIndex]].par;;
         return token;
      };
   
      lunr.Pipeline.registerFunction(pipelineFunction, 'paragraph');
      builder.pipeline.add(pipelineFunction);
      builder.metadataWhitelist.push('paragraph');
   }
   
   function addDocTitleMetadata(builder, parsedDocs) {
      var pipelineFunction = function(token) {
         var docIndex = builder.documentCount - 1;
         token.metadata['docTitle'] = parsedDocs[Object.keys(parsedDocs)[docIndex]].doc;
   
         return token;
      };
      
      lunr.Pipeline.registerFunction(pipelineFunction, 'docTitle');
      builder.pipeline.add(pipelineFunction);
      builder.metadataWhitelist.push('docTitle');
   }
   
   function addDocIdMetadata(builder, parsedDocs) {
      var pipelineFunction = function(token) {
         var docIndex = builder.documentCount - 1;
         token.metadata['docId'] = parsedDocs[Object.keys(parsedDocs)[docIndex]].docId;
      
         return token;
      };
   
      lunr.Pipeline.registerFunction(pipelineFunction, 'docId');
      builder.pipeline.add(pipelineFunction);
      builder.metadataWhitelist.push('docId');
   }
   
   Index.prototype.createIndex = function(parsedDocs) {
      console.time('INDEX');
      this.index = lunr(function() {
         this.pipeline.remove(lunr.trimmer);
         this.pipeline.remove(lunr.stemmer);
         this.pipeline.remove(lunr.stopWordFilter);
         
         this.ref('doc');
         this.field('diplomaticText');
         this.field('interpretativeText');
         this.use(addDocTitleMetadata, parsedDocs);
         this.use(addDocIdMetadata, parsedDocs);
         this.use(addParagraphMetadata, parsedDocs);
         this.use(addPageMetadata, parsedDocs);
         this.use(addPageIdMetadata, parsedDocs);
         this.use(addLineMetadata, parsedDocs);
         this.use(addLineIdMetadata, parsedDocs);
         this.metadataWhitelist = ['docTitle', 'docId', 'paragraph', 'page', 'pageId', 'line', 'lineId'];
         
         for(var document in parsedDocs) {
            var doc = map(parsedDocs[document]);
            this.add(doc);
         }
      });
      console.timeEnd('INDEX');
      
   };
   
   Index.prototype.getIndex = function() {
      return this.index;
   };
});
