var lunr = require('lunr');

angular.module('evtviewer.dataHandler')

.service('evtSearchIndex', function Index() {
   
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
   
   Index.prototype.createIndex = function(parsedDocs) {
   
      console.time('INDEX');
      var index = lunr(function() {
         this.ref('doc');
         this.field('diplomaticText');
         this.field('interpretativeText');
         this.use(addPageMetadata, parsedDocs);
         this.use(addLineMetadata, parsedDocs);
         this.metadataWhitelist = ['page', 'line'];
         
         for(var z = 0; z < parsedDocs.length; z++){
            var doc = map(parsedDocs[z]);
            this.add(doc);
         }
      });
      console.timeEnd('INDEX');
      
      /*var res = index.search('DUQUE');
      console.log('Search Results', res);*/
   };
});
