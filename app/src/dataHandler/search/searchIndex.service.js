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
   
            this.tokenizer = customTokenizer;
            this.tokenizer.separator = /[\s,.;:/?!()]+/;
            
            this.ref('xmlDocId');
            this.field('diplomaticText');
            this.field('interpretativeText');
            this.use(addXmlDocTitleMetadata, parsedElementsForIndexing);
            this.use(addXmlDocIdMetadata, parsedElementsForIndexing);
            this.use(addParagraphMetadata, parsedElementsForIndexing);
            this.use(addPageMetadata, parsedElementsForIndexing);
            this.use(addPageIdMetadata, parsedElementsForIndexing);
            this.use(addLineMetadata, parsedElementsForIndexing);
            this.use(addDocIdMetadata, parsedElementsForIndexing);
            this.use(addPositionMetadata, parsedElementsForIndexing);
            
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
      
      function addXmlDocTitleMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            token.metadata['xmlDocTitle'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].xmlDocTitle;
            
            return token;
         };
         
         lunr.Pipeline.registerFunction(pipelineFunction, 'xmlDocTitle');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('xmlDocTitle');
      }
      
      function addXmlDocIdMetadata(builder, parsedElementsForIndexing) {
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
            token.metadata['paragraph'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].paragraph;
            return token;
         };
         
         if(parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].paragraph !== undefined) {
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
         var docIndex = 0;
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            token.metadata['line'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].line;
            return token;
         };
   
         if(parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].line !== undefined) {
            lunr.Pipeline.registerFunction(pipelineFunction, 'line');
            builder.pipeline.add(pipelineFunction);
            builder.metadataWhitelist.push('line');
         }
      }
      
      function addDocIdMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            token.metadata['docId'] = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]].docId;
            return token;
         };
         
         lunr.Pipeline.registerFunction(pipelineFunction, 'docId');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('docId');
      }
      
      function addPositionMetadata(builder) {
         builder.metadataWhitelist.push('position');
      }
      
      /* PLUGINS */
      var customTokenizer = function(obj) {
         var str = obj.toString().trim(),
            strLength = str.length,
            char,
            token,
            tokens = [],
            tokenLength,
            prevTokenEndIndex,
            isCompoundWord;
   
         for (var endIndex = 0, startIndex = 0; endIndex <= strLength; endIndex++) {
            char = str.charAt(endIndex);
            tokenLength = endIndex - startIndex;
            
            if(char === '-') {
               token =  str.slice(startIndex, endIndex);
               prevTokenEndIndex = endIndex;
               tokens.push(
                  new lunr.Token (token, {
                     position: [startIndex, tokenLength],
                     index: tokens.length
                  })
               );
            }
            
            if ((char.match(this.tokenizer.separator) || endIndex === strLength)) {
               token = str.slice(startIndex, endIndex);
               isCompoundWord = token.indexOf('-') !== -1;
               
               if(isCompoundWord) {
                  var tok = str.slice(prevTokenEndIndex + 1, endIndex);
                  tokens.push(
                     new lunr.Token (tok, {
                        position: [prevTokenEndIndex + 1, tokenLength],
                        index: tokens.length
                     })
                  );
               }
               
               if (tokenLength > 0) {
                  tokens.push(
                     new lunr.Token (token, {
                        position: [startIndex, tokenLength],
                        index: tokens.length
                     })
                  );
               }
               startIndex = endIndex + 1;
            }
         }
         return tokens;
      };
   });
