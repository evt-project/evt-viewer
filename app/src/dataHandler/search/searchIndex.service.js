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
         token.metadata['line'] = parsedDocs[docIndex].line;
         return token;
      };
      
      lunr.Pipeline.registerFunction(pipelineFunction, 'line');
      builder.pipeline.add(pipelineFunction);
      builder.metadataWhitelist.push('line');
   }
   
   function addPageMetadata(builder, parsedDocs) {
      var pipelineFunction = function(token) {
         var docIndex = builder.documentCount - 1;
         token.metadata['page'] = parsedDocs[docIndex].page;
         return token;
      };
      
      lunr.Pipeline.registerFunction(pipelineFunction, 'page');
      builder.pipeline.add(pipelineFunction);
      builder.metadataWhitelist.push('page');
   }
   
   function addDocTitleMetadata(builder, parsedDocs) {
      var pipelineFunction = function(token) {
         var docIndex = builder.documentCount - 1;
         token.metadata['docTitle'] = parsedDocs[docIndex].doc;
         return token;
      };
      
      lunr.Pipeline.registerFunction(pipelineFunction, 'docTitle');
      builder.pipeline.add(pipelineFunction);
      builder.metadataWhitelist.push('docTitle');
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
         this.use(addPageMetadata, parsedDocs);
         this.use(addLineMetadata, parsedDocs);
         this.metadataWhitelist = ['docTitle', 'page', 'line', 'position'];
         
         for(var z = 0; z < parsedDocs.length; z++){
            var doc = map(parsedDocs[z]);
            this.add(doc);
         }
      });
      console.timeEnd('INDEX');;
      
   };
   
   Index.prototype.getIndex = function() {
      return this.index;
   };
});
