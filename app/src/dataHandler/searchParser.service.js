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
               addWord();
            }

            node = nodes.iterateNext();
            if(node !== null && node.nodeName === 'choice') {
               currentChoiceNode = node;
               checkCurrentChoiceNode(node, doc);
               node = currentChoiceNode;
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
            findGlyph(doc);
            addGlyph(currentGlyph);
            addSpace();
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
      let found = glyphs.some(function(element) {
         return element.id === glyph.id;
      });
      if(!found) {
         glyphs.push(glyph);
      }
      return glyph;
   };

   let findGlyph = function(doc) {
      sRef = node.getAttribute('ref');
      sRef = sRef.replace('#', '');
      glyphNode = getGlyphNode(doc);
      currentGlyph = getGlyph(glyphNode);
      return currentGlyph;
   };

   let replaceGlyphTag = function(childNode, innerHtml, innerHtmlChild, doc) {
      let replaceGTag,
          toReplace = innerHtmlChild,
          glyph;

      node = childNode;
      glyph = findGlyph(doc);
      replaceGTag = innerHtml.replace(toReplace, glyph.diplomatic);

      while(replaceGTag.includes(toReplace)) {
         replaceGTag = replaceGTag.replace(toReplace, glyph.diplomatic);
      }

      return replaceGTag;
   };

   let addGlyph = function(currentGlyph) {
      checkCurrentGlyphEdition();
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

   let checkCurrentGlyphEdition = function() {
      currentEdition = mainNode.dataset.edition;
      return currentEdition;
   };

   let checkCurrentEdition = function(node) {
      let nodeName = node.nodeName,
          iterate;

      mainNode = document.getElementById('mainText');
      currentEdition = mainNode.dataset.edition;

      if(currentEdition === 'diplomatic') {
         switch (nodeName) {
            case 'corr':
            case 'reg':
            case 'expan':
            case 'ex':
               iterateNode(node);
         }
      }
      if(currentEdition === 'interpretative') {
         switch (nodeName) {
            case 'sic':
            case 'orig':
            case 'abbr':
            case 'am':
               for(let i = 0; i < node.childNodes.length; i++) {
                  iterate = nodes.iterateNext();
                  for(let j = 0; j < node.childNodes[i].childNodes.length; i++) {
                     iterate = nodes.iterateNext();
                  }
               }
         }
      }
   };

   let checkCurrentChoiceNode = function (node, doc) {
         let word = {},
             children = node.children,
             childNode,
             childNodeName,
             nodeHaveChild,
             innerHtml,
             innerHtmlChild;

         for(let i = 0; i < children.length; i++) {
            childNodeName = children[i].nodeName;
            innerHtml = children[i].innerHTML;
            nodeHaveChild = children[i].children.length !== 0;

            if(nodeHaveChild) {
               for (let j = 0; j < children[i].children.length; j++) {
                  innerHtmlChild = children[i].children[j].outerHTML;

                  childNode = checkChildNode(children[i].children[j]);
                  switch (childNodeName) {
                     case 'sic':
                     case 'orig':
                     case 'abbr':
                     case 'am':
                           if (childNode && childNode.nodeName === 'g') {
                              word.diplomatic = replaceGlyphTag(childNode, innerHtml, innerHtmlChild, doc);
                              innerHtml = word.diplomatic;
                           }
                           else {
                              innerHtml = innerHtml.replace(innerHtmlChild, children[i].children[j].textContent);
                              word.diplomatic = children[i].textContent;
                           }
                        break;
                     case 'corr':
                     case 'reg':
                     case 'expan':
                     case 'ex':
                        word.interpretative = children[i].textContent;
                        break;
                  }
               }
            }
            else {
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
         }
         editionWords.push(word);
   };

   let checkChildNode = function(childNode) {
      if(childNode.children.length === 0) {
         switch (childNode.nodeName) {
            case 'g':
               return childNode;
         }
      }
      else {
         for (let i = 0; i < childNode.children.length; i++) {
            childNode = childNode.children[i];
            checkChildNode(childNode);
         }
      }
      return childNode;
   };

   let iterateNode = function(node) {
      let iterate;

      for (let i = 0; i < node.childNodes.length; i++) {
         iterate = nodes.iterateNext();
         while (iterate.childNodes.length !== 0) {
            for (let j = 0; j < iterate.childNodes.length; j++) {
               iterate = nodes.iterateNext();
            }
         }
      }
      node = iterate;
      return node;
   };

   let containOnlySpace = function() {
      return jQuery.trim(str).length === 0;
   };

   let addWord = function() {
      let nextSibling = node.nextSibling,
          previousSibling = node.previousSibling;


      if (node.parentNode.parentNode.nodeName === 'choice' && nextSibling !== null && previousSibling !== null || node.parentNode.nodeName === 'hi') {
         text += str;
      }
      else if (nextSibling === null && previousSibling === null) {
         text += ' ' + str + ' ';
      }
      else if (nextSibling === null || nextSibling.nodeName === 'pb' || nextSibling.nodeName === 'lb') {
         text += str + ' ';
      }
      else if (previousSibling === null || previousSibling.nodeName === 'pb' || previousSibling.nodeName === 'lb') {
         text += ' ' + str;
      }
      else {
         text += str;
      }
   };

   let addSpace = function() {
      let nextSibling = node.nextSibling,
          previousSibling = node.previousSibling;

      if(nextSibling === null && previousSibling !== null) {
            text += ' ';
      }
      else if (nextSibling === null && previousSibling === null) {
         text += '';
      }
      else {
         text += '';
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
