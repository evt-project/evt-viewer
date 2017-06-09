import * as JsSearch from 'js-search';
//import SearchApi from 'js-worker-search';

angular.module('evtviewer.dataHandler')

.service('evtSearchParser', function ($log) {
   let parser  =  {};
   console.log("SEARCH PARSER RUNNING");

   let text = '',
       str = '',

       nodes,
       node,
       mainNode,

       currentEdition,
       currentGlyph,
       currentChoiceNode,

       glyphs = [],
       editionWords = [],
       glyphNode,
       glyphId = '',
       sRef = '',

       regex = /[.,\/#!$%\^&\*;:{}=\-_`~()]/;

   parser.parseWords = function (doc) {
     text = getText(doc);

     /*let tokenize = new JsSearch.SimpleTokenizer();
     let words = tokenize.tokenize(text);
     console.log(words);*/

     //const searchApi = new SearchApi();

     //var c = searchApi.indexDocument(doc);
     /*let c = searchApi.indexDocument('foo', 'Text describing an Object identified as "foo"');
     let d = searchApi.indexDocument('bar', 'Text describing an Object identified as "bar"');*/
     //const promise = searchApi.search('describing');
   };

   let getText = function(doc) {
      let nsResolver = {
         lookupNamespaceURI: function (prefix) {
            prefix = 'ns';
            let namespace = doc.documentElement.namespaceURI;
            return namespace;
         }
      };
      let path;

      doc.documentElement.namespaceURI == null ? path = '//body//node()[not(self::comment())]' : path = '//ns:body//node()[not(self::comment())]';
      nodes = doc.evaluate(path, doc, nsResolver, XPathResult.ANY_TYPE, null);

      node = nodes.iterateNext();
      str = node.nodeValue;

      while (node || str === null || containOnlySpace()) {
         if (node.tagName !== 'g' || !containOnlySpace()) {
            str = node.nodeValue;
            checkCurrentEdition(node);

            if (str !== null && !containOnlySpace()) {
               addSpace();
            }

            node = nodes.iterateNext();
            if(node !== null && node.nodeName === 'choice') {
               currentChoiceNode = node;
               checkCurrentNode(node);
            }

            if (node === null) {
               console.log(text);
               console.log(glyphs);
               console.log(editionWords);
               return text;
            }
            str = node.nodeValue;
         }
         else {
            addGlyph(doc);
            node = nodes.iterateNext();
         }
         cleanText();
      }
   };

   let getGlyphNode = function(doc) {
      let path = "//charDecl/node()[not(self::comment())]",
          nodes = doc.evaluate(path, doc, null, XPathResult.ANY_TYPE, null),
          node = nodes.iterateNext();

      while(node) {
         if (node.tagName === 'glyph' || node.tagName === 'char') {
            glyphId = node.getAttribute('xml:id');
            if (glyphId === sRef) {
               glyphNode = node;
               return glyphNode;
            }
            node = nodes.iterateNext();
         }
         node = nodes.iterateNext();
      }
      return glyphNode;
   };

   let getGlyph = function(node) {
      let map = node.getElementsByTagName('mapping');
      let glyph = {},
          type;

      glyph.id = glyphId;
      for(let i = 0; i < map.length; i++) {
         type = map[i].getAttribute('type');
         switch (type) {
            case 'diplomatic':
            case 'normalized':
               glyph[type] = map[i].textContent;
               break;
         }
      }
      if(glyphs.length === 0) {
         glyphs.push(glyph);
      }
      let found = glyphs.some(function(el) {
         return el.id === glyph.id;
      });
      if(!found) {
         glyphs.push(glyph);
      }
      return glyph;
   };

   let addGlyph = function(doc) {
      sRef = node.getAttribute('ref');
      sRef = sRef.replace('#', '');
      glyphNode = getGlyphNode(doc);
      currentGlyph = getGlyph(glyphNode);
      checkGlyphEdition(currentGlyph);
   };

   let checkGlyphEdition = function(currentGlyph) {
      currentEdition = mainNode.dataset.edition;
      switch (currentEdition) {
         case 'diplomatic':
            text += currentGlyph.diplomatic;
            break;
         case 'interpretative':
            text += currentGlyph.normalized;
            break;
         default:
            text += currentGlyph;
      }
   };

   let checkCurrentEdition = function(node) {
      let nodeName = node.nodeName;

      mainNode = document.getElementById('mainText');
      currentEdition = mainNode.dataset.edition;

      if(currentEdition === 'diplomatic') {
         switch (nodeName) {
            case 'corr':
            case 'reg':
            case 'expan':
            case 'ex':
            node = nodes.iterateNext();
            node = nodes.iterateNext();
         }
      }
      if(currentEdition === 'interpretative') {
         switch (nodeName) {
            case 'sic':
            case 'orig':
            case 'abbr':
            case 'am':
            node = nodes.iterateNext();
            node = nodes.iterateNext();
         }
      }
   };

   let checkCurrentNode = function (node) {
         let word = {},
             children = node.children,
             childNodeName;

         for(let i = 0; i < children.length; i++) {
            childNodeName = children[i].nodeName;
            switch(childNodeName) {
               case 'sic':
               case 'orig':
               case 'abbr':
               case 'am':
                  word.diplomatic = children[i].textContent;
                  break;
               case 'corr':
               case 'reg':
               case 'expan':
               case 'ex':
                  word.interpretative = children[i].textContent;
                  break;
            }
         }
         editionWords.push(word);
   };

   let containOnlySpace = function() {
      return jQuery.trim(str).length === 0;
   };

   let addSpace = function() {
      if (node.parentNode.parentNode.nodeName === 'choice' && node.nextSibling !== null && node.previousSibling !== null || node.parentNode.nodeName === 'hi') {
         text += str;
      }
      else if (node.nextSibling === null && node.previousSibling === null) {
         text += ' ' + str + ' ';
      }
      else if (node.nextSibling === null || node.nextSibling.nodeName === 'pb' || node.nextSibling.nodeName === 'lb') {
         text += str + ' ';
      }
      else if (node.previousSibling === null || node.previousSibling.nodeName === 'pb' || node.previousSibling.nodeName === 'lb') {
         text += ' ' + str;
      }
      else {
         text += str;
      }
   };

   let cleanText = function () {
      let replace,
          choice = document.getElementsByClassName('choice');

      while(text.match(regex)) {
         replace = text.replace(regex, "");
         text = replace;
      }
      while(text.match(/\s\s/)){
         replace = text.replace(/\s\s/, " ");
         text = replace;
      }
   };

   return parser;
});
