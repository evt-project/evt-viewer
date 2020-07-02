var lunr = require('lunr');

angular.module('evtviewer.dataHandler')
   .service('evtSearchIndex', ['evtSearchDocument', function Index(evtSearchDocument) {
      this.index = {};

      Index.prototype.createIndex = function (parsedElementsForIndexing) {
         console.time('INDEX TIME');

         var document;
         this.index = lunr(function () {
            this.pipeline.remove(lunr.trimmer);
            this.pipeline.remove(lunr.stemmer);
            this.pipeline.remove(lunr.stopWordFilter);

            this.tokenizer = customTokenizer;
            this.tokenizer.separator = /[\s,.;:/?!()\'\"]+/;

            this.ref('xmlDocId');

            if (evtSearchDocument.isDiplEdition() && parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[0]].content.diplomatic !== undefined) {
               this.field('diplomaticText');
               if (evtSearchDocument.isInterpEdition()) {
                  this.field('interpretativeText');
               }
            } else if (evtSearchDocument.isInterpEdition()) {
               this.field('interpretativeText');
            } else {
               this.field('content');
            }

            this.use(addXmlDocTitleMetadata, parsedElementsForIndexing);
            this.use(addXmlDocIdMetadata, parsedElementsForIndexing);
            this.use(addSectionMetadata, parsedElementsForIndexing);
            this.use(addParagraphMetadata, parsedElementsForIndexing);
            this.use(addPageMetadata, parsedElementsForIndexing);
            this.use(addPageIdMetadata, parsedElementsForIndexing);
            this.use(addLineMetadata, parsedElementsForIndexing);
            this.use(addLbIdMetadata, parsedElementsForIndexing);
            this.use(addDocIdMetadata, parsedElementsForIndexing);
            this.use(addPositionMetadata, parsedElementsForIndexing);
            this.use(addOriginalTokenMetadata, parsedElementsForIndexing);

            for (var i in parsedElementsForIndexing) {
               if (i !== 'countAllLines') {
                  document = map(parsedElementsForIndexing[i]) || undefined;
                  this.add(document);
               }
            }
         });
         console.timeEnd('INDEX TIME');
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
            interpretativeText: xmlDoc.content.interpretative,
            content: xmlDoc.content
         };
         return document;
      }

      function addXmlDocTitleMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            var docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
            token.metadata['xmlDocTitle'] = docParsedElsForIndexing ? docParsedElsForIndexing.xmlDocTitle : undefined;

            return token;
         };

         lunr.Pipeline.registerFunction(pipelineFunction, 'xmlDocTitle');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('xmlDocTitle');
      }

      function addXmlDocIdMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            var docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
            token.metadata['xmlDocId'] = docParsedElsForIndexing ? docParsedElsForIndexing.xmlDocId : undefined;

            return token;
         };

         lunr.Pipeline.registerFunction(pipelineFunction, 'xmlDocId');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('xmlDocId');
      }

      function addSectionMetadata(builder, parsedElementsForIndexing) {
         var docIndex = 0;
         var docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
         var pipelineFunction = function (token) {
            docIndex = builder.documentCount - 1;
            docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
            token.metadata['sectionTitle'] = docParsedElsForIndexing ? docParsedElsForIndexing.sectionTitle : undefined;
            return token;
         };

         if (docParsedElsForIndexing && docParsedElsForIndexing.sectionTitle !== undefined) {
            lunr.Pipeline.registerFunction(pipelineFunction, 'sectionTitle');
            builder.pipeline.add(pipelineFunction);
            builder.metadataWhitelist.push('sectionTitle');
         }
      }

      function addParagraphMetadata(builder, parsedElementsForIndexing) {
         var docIndex = 0;
         var docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
         var pipelineFunction = function (token) {
            docIndex = builder.documentCount - 1;
            docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
            token.metadata['paragraph'] = docParsedElsForIndexing ? docParsedElsForIndexing.paragraph : undefined;
            return token;
         };

         if (docParsedElsForIndexing && docParsedElsForIndexing.paragraph !== undefined) {
            lunr.Pipeline.registerFunction(pipelineFunction, 'paragraph');
            builder.pipeline.add(pipelineFunction);
            builder.metadataWhitelist.push('paragraph');
         }
      }

      function addPageMetadata(builder, parsedElementsForIndexing) {
         var docIndex = 0;
         var docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
         var pipelineFunction = function (token) {
            docIndex = builder.documentCount - 1;
            docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
            token.metadata['page'] = docParsedElsForIndexing ? docParsedElsForIndexing.page : undefined;
            return token;
         };

         if (docParsedElsForIndexing && docParsedElsForIndexing.page !== undefined) {
            lunr.Pipeline.registerFunction(pipelineFunction, 'page');
            builder.pipeline.add(pipelineFunction);
            builder.metadataWhitelist.push('page');
         }
      }

      function addPageIdMetadata(builder, parsedElementsForIndexing) {
         var docIndex = 0;
         var docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
         var pipelineFunction = function (token) {
            docIndex = builder.documentCount - 1;
            docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
            token.metadata['pageId'] = docParsedElsForIndexing ? docParsedElsForIndexing.pageId : undefined;
            return token;
         };

         if (docParsedElsForIndexing && docParsedElsForIndexing.page !== undefined) {
            lunr.Pipeline.registerFunction(pipelineFunction, 'pageId');
            builder.pipeline.add(pipelineFunction);
            builder.metadataWhitelist.push('pageId');
         }
      }

      function addLineMetadata(builder, parsedElementsForIndexing) {
         var docIndex = 0;
         var docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
         var pipelineFunction = function (token) {
            docIndex = builder.documentCount - 1;
            docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
            token.metadata['line'] = docParsedElsForIndexing ? docParsedElsForIndexing.line : undefined;
            return token;
         };

         if (docParsedElsForIndexing && docParsedElsForIndexing.line !== undefined) {
            lunr.Pipeline.registerFunction(pipelineFunction, 'line');
            builder.pipeline.add(pipelineFunction);
            builder.metadataWhitelist.push('line');
         }
      }

      function addLbIdMetadata(builder, parsedElementsForIndexing) {
         var docIndex = 0;
         var docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
         var pipelineFunction = function (token) {
            docIndex = builder.documentCount - 1;
            docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
            token.metadata['lbId'] = docParsedElsForIndexing ? docParsedElsForIndexing.lbId : undefined;
            return token;
         };

         if (docParsedElsForIndexing && docParsedElsForIndexing.lbId !== undefined) {
            lunr.Pipeline.registerFunction(pipelineFunction, 'lbId');
            builder.pipeline.add(pipelineFunction);
            builder.metadataWhitelist.push('lbId');
         }
      }

      function addDocIdMetadata(builder, parsedElementsForIndexing) {
         var pipelineFunction = function (token) {
            var docIndex = builder.documentCount - 1;
            var docParsedElsForIndexing = parsedElementsForIndexing[Object.keys(parsedElementsForIndexing)[docIndex]];
            token.metadata['docId'] = docParsedElsForIndexing ? docParsedElsForIndexing.docId : undefined;
            return token;
         };

         lunr.Pipeline.registerFunction(pipelineFunction, 'docId');
         builder.pipeline.add(pipelineFunction);
         builder.metadataWhitelist.push('docId');
      }

      function addPositionMetadata(builder) {
         builder.metadataWhitelist.push('position');
      }

      function addOriginalTokenMetadata(builder) {
         builder.metadataWhitelist.push('originalToken');
      }

      /* PLUGINS FOR LUNR.JS */
      var customTokenizer = function (obj) {
         var str = obj.toString().trim(),
            strLength = str.length,
            char,
            token,
            originalToken,
            tokens = [],
            tokenLength,
            prevTokenEndIndex,
            isCompoundWord;

         for (var endIndex = 0, startIndex = 0; endIndex <= strLength; endIndex++) {
            char = str.charAt(endIndex);
            tokenLength = endIndex - startIndex;

            if (char === '-') {
               token = str.slice(startIndex, endIndex);
               prevTokenEndIndex = endIndex;
               tokens.push(
                  new lunr.Token(token, {
                     position: [startIndex, tokenLength],
                     index: tokens.length,
                     originalToken: token
                  })
               );
            }

            if ((char.match(this.tokenizer.separator) || endIndex === strLength)) {
               token = str.slice(startIndex, endIndex);
               originalToken = token;
               token = token.toLowerCase();
               isCompoundWord = token.indexOf('-') !== -1;

               if (isCompoundWord) {
                  var tok = str.slice(prevTokenEndIndex + 1, endIndex);
                  tokens.push(
                     new lunr.Token(tok, {
                        position: [prevTokenEndIndex + 1, tokenLength],
                        index: tokens.length,
                        originalToken: tok
                     })
                  );
               }

               if (tokenLength > 0) {
                  tokens.push(
                     new lunr.Token(token, {
                        position: [startIndex, tokenLength],
                        index: tokens.length,
                        originalToken: originalToken
                     })
                  );
               }
               startIndex = endIndex + 1;
            }
         }
         return tokens;
      };
   }]);
