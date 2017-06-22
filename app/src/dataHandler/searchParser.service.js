import * as JsSearch from 'js-search';
//import SearchApi from 'js-worker-search';

angular.module('evtviewer.dataHandler')

.service('evtSearchParser', function () {
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
       currentAppNode,

       glyphs = [],
       editionWords = [],
       glyphNode,
       glyphId = '',
       sRef = '',

       regex = /[.,\/#!$%\^&\*;:{}=\-_`~()<>]/;

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

   let nsResolver = function() {
      let nsResolver = {
         lookupNamespaceURI: function (prefix) {
            prefix = 'ns';
            let namespace = doc.documentElement.namespaceURI;
            return namespace;
         }
      };
   };

   let getText = function(doc) {
      nsResolver();

      let path;

      doc.documentElement.namespaceURI == null ? path = '//body//node()[not(self::comment())]' : path = '//ns:body//node()[not(self::comment())]';
      nodes = doc.evaluate(path, doc, nsResolver, XPathResult.ANY_TYPE, null);

      node = nodes.iterateNext();
      str = node.nodeValue;

      while (node || str === null || containOnlySpace(str)) {
         if (node.tagName !== 'g' || !containOnlySpace(str)) {
            str = node.nodeValue;
            checkNodeIteration(node);
            checkCurrentEditionIteration(node);

            if (str !== null && !containOnlySpace(str)) {
               addWord();
            }

            node = nodes.iterateNext();

            if(node !== null) {
               switch(node.nodeName) {
                  case 'choice':
                     currentChoiceNode = node;
                     checkCurrentChoiceNode(node, doc);
                     node = currentChoiceNode;
                     break;
                  case 'app':
                     currentAppNode = node;
                     checkCurrentAppNode(node, doc);
                     node = currentAppNode;
                     break;
               }
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

   /* **************************** */
   /* BEGIN getGlyphNode(doc)      */
   /* @doc -> current xml document */
   /* **************************** */
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

   /* ******************** */
   /* BEGIN getGlyph(node) */
   /* ******************** */
   let getGlyph = function(node) {
      let map = node.getElementsByTagName('mapping');
      let glyph = {},
          type,
          found;

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
      found = glyphs.some(function(element) {
         return element.id === glyph.id;
      });
      if(!found) {
         glyphs.push(glyph);
      }
      return glyph;
   };

   /* ********************* */
   /* BEGIN findGlyph(node) */
   /* ***************************************** */
   /* Function to find a glyph in xml document  */
   /* @doc -> current xml document              */
   /* ***************************************** */
   let findGlyph = function(doc) {
      sRef = node.getAttribute('ref');
      sRef = sRef.replace('#', '');
      glyphNode = getGlyphNode(doc);
      currentGlyph = getGlyph(glyphNode);
      return currentGlyph;
   };

   /* **************************************************************** */
   /* BEGIN replaceGlyphTag(childNode, innerHtml, innerHtmlChild, doc) */
   /* **************************************************************** */
   /* Function to replace current glyph tag with glyph   */
   /* @childNode -> current childNode                    */
   /* @innerHtml -> code in which replace outerHtmlChild */
   /* @outerHtmlChild -> code to replace in innerHtml    */
   /* @doc -> current xml doc                            */
   /* ************************************************** */
   let replaceGlyphTag = function(childNode, innerHtml, outerHtmlChild, doc) {
      let replaceGTag,
          toReplace = outerHtmlChild,
          glyph;

      node = childNode;
      glyph = findGlyph(doc);
      replaceGTag = innerHtml.replace(toReplace, glyph.diplomatic);

      while(replaceGTag.includes(toReplace)) {
         replaceGTag = replaceGTag.replace(toReplace, glyph.diplomatic);
      }

      return replaceGTag;
   };

   /* **************************** */
   /* BEGIN addGlyph(currentGlyph) */
   /* *************************************************** */
   /* Function to add the current glyph in text (string)  */
   /* @currentGlyph -> current glyph                      */
   /* *************************************************** */
   let addGlyph = function(currentGlyph) {
      checkCurrentEdition();
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

   /* *************************** */
   /* BEGIN checkCurrentEdition() */
   /* *************************************************** */
   /* Function to check current Edition                   */
   /* *************************************************** */
   let checkCurrentEdition = function() {
      currentEdition = mainNode.dataset.edition;
      return currentEdition;
   };

   /* **************************************** */
   /* BEGIN checkCurrentEditionIteration(node) */
   /* ************************************************************* */
   /* Function to iterate node that don't belong to current edition */
   /* @node -> current node                                         */
   /* ************************************************************* */
   let checkCurrentEditionIteration = function(node) {
      let nodeName = node.nodeName;

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
               iterateNode(node);
         }
      }
   };

   /* ****************************** */
   /* BEGIN checkNodeIteration(node) */
   /* ********************************** */
   /* Function to iterate specific nodes */
   /* @node -> current node              */
   /* ********************************** */
   let checkNodeIteration = function(node) {
      let nodeName = node.nodeName;

      switch(nodeName) {
         case 'note':
            iterateNode(node);
      }
   };

   /* *************************************** */
   /* BEGIN checkCurrentChoiceNode(node, doc) */
   /* ************************************************************************* */
   /* Function to check current choice node and create an array (EditionWords), */
   /* that contain diplomatic lectio and interpretative lectio                  */
   /* @node -> current node                                                     */
   /* @doc -> current xml document                                              */
   /* ************************************************************************* */
   let checkCurrentChoiceNode = function(node, doc) {
      let word = {},
         children = node.children,
         childNode,
         childNodeName,
         nodeHaveChild,
         innerHtml,
         outerHtmlChild;

      for(let i = 0; i < children.length; i++) {
         childNodeName = children[i].nodeName;
         innerHtml = children[i].innerHTML;
         nodeHaveChild = children[i].children.length !== 0;

         if(nodeHaveChild) {
            for (let j = 0; j < children[i].children.length; j++) {
               outerHtmlChild = children[i].children[j].outerHTML;

               childNode = checkChildNode(children[i].children[j]);

               switch (childNodeName) {
                  case 'sic':
                  case 'orig':
                  case 'abbr':
                  case 'am':
                     if (childNode && childNode.nodeName === 'g') {
                        word.diplomatic = replaceGlyphTag(childNode, innerHtml, outerHtmlChild, doc);
                        innerHtml = word.diplomatic;
                     }
                     else {
                        innerHtml = innerHtml.replace(outerHtmlChild, children[i].children[j].textContent);
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

   let checkCurrentAppNode = function(node, doc) {
      let word = {},
          children = node.children,
          childNodeName;

      for(let i = 0; i < children.length; i++) {
         childNodeName = children[i].nodeName;

         switch(childNodeName) {
            case 'lem':
               word.critical = {A: children[i].textContent};
         }
      }
   };

   /* ******************************* */
   /* BEGIN checkChildNode(childNode) */
   /* ********************************************************** */
   /* Function to check if childNodes contain a specific element */
   /* @childNode -> current childNode                            */
   /* ********************************************************** */
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

   /* ************************ */
   /* BEGIN iterateNode(node)  */
   /* **************************/
   /* Function to iterate node */
   /* @node -> current node    */
   /* **************************/
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

   /* *************** */
   /* BEGIN addWord() */
   /* *************************************** */
   /* Function to add word in text (string) */
   /* *************************************** */
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

   /* *************** */
   /* BEGIN addSpace() */
   /* ************************************* */
   /* Function to add space where necessary */
   /* ************************************* */
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

   /* *************************** */
   /* BEGIN containOnlySpace(str) */
   /* *************************** */
   /* Function to check if string (str) contains only spaces */
   /* @str -> string to check                                */
   /* ****************************************************** */
   let containOnlySpace = function(str) {
      return jQuery.trim(str).length === 0;
   };

   /* ***************** */
   /* BEGIN cleanText() */
   /* **************************************************************** */
   /* Function to clean text (string) from spaces and some punctuation */
   /* **************************************************************** */
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
