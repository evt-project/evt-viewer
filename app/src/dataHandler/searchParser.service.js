import * as JsSearch from 'js-search';
//import SearchApi from 'js-worker-search';

angular.module('evtviewer.dataHandler')

.service('evtSearchParser', function (parsedData, evtInterface) {
   let parser = {};
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
       glyphId = '',
       sRef = '',

       word = {},
       editionWords = [],

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

   let getText = function (doc) {
      let path;
      let nsResolver = {
         lookupNamespaceURI: function (prefix) {
            prefix = 'ns';
            let namespace = doc.documentElement.namespaceURI;
            return namespace;
         }
      };

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

            if (node !== null) {
               checkCurrentNode(node, doc);
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
            currentGlyph = getGlyph(doc);
            addGlyph(currentGlyph);
            addSpace();
            node = nodes.iterateNext();
         }
         text = cleanText(text);
      }
   };

   /*** GLYPHS ***/

   /* *************************** */
   /* BEGIN getCurrentGlyph(node) */
   /* ***************************************** */
   /* Function to find a glyph in xml document  */
   /* @doc -> current xml document              */
   /* ***************************************** */
   let getCurrentGlyph = function () {
      let glyphs = parsedData.getGlyphs();

      sRef = node.getAttribute('ref');
      sRef = sRef.replace('#', '');
      glyphId = sRef;

      currentGlyph = glyphs[sRef].mapping;
      return currentGlyph;
   };

   /* *************************** */
   /* BEGIN getGlyph(node)        */
   /* *************************** */
   let getGlyph = function () {
      let glyph = {},
          found;

      currentGlyph = getCurrentGlyph();

      glyph.id = glyphId;
      currentGlyph.diplomatic !== undefined ? glyph.diplomatic = currentGlyph.diplomatic.content : glyph.diplomatic = '';
      currentGlyph.normalized !== undefined ? glyph.interpretative = currentGlyph.normalized.content: glyph.interpretative = '';

      if (glyphs.length === 0) {
         glyphs.push(glyph);
      }
      found = glyphs.some(function (element) {
         return element.id === glyph.id;
      });
      if (!found) {
         glyphs.push(glyph);
      }
      return glyph;
   };

   /* **************************** */
   /* BEGIN addGlyph(currentGlyph) */
   /* *************************************************** */
   /* Function to add the current glyph in text (string)  */
   /* @currentGlyph -> current glyph                      */
   /* *************************************************** */
   let addGlyph = function (currentGlyph) {
      getCurrentEdition();

      switch (currentEdition) {
         case 'diplomatic':
            text += currentGlyph.diplomatic;
            break;
         case 'interpretative':
            text += currentGlyph.normalized;
            break;
      }
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
   let replaceGlyphTag = function (childNode, innerHtml, outerHtmlChild) {
      let replaceGTag,
          toReplace = outerHtmlChild,
          glyph;

      node = childNode;
      glyph = getGlyph();
      replaceGTag = innerHtml.replace(toReplace, glyph.diplomatic);

      while (replaceGTag.includes(toReplace)) {
         replaceGTag = replaceGTag.replace(toReplace, glyph.diplomatic);
      }

      return replaceGTag;
   };


   /*** EDITION ***/

   /* ************************* */
   /* BEGIN getCurrentEdition() */
   /* ******************************* */
   /* Function to get current Edition */
   /* ******************************* */
   let getCurrentEdition = function () {
      currentEdition = evtInterface.getState('currentEdition');
      return currentEdition;
   };

   /* **************************************** */
   /* BEGIN checkCurrentEditionIteration(node) */
   /* ************************************************************* */
   /* Function to iterate node that don't belong to current edition */
   /* @node -> current node                                         */
   /* ************************************************************* */
   let checkCurrentEditionIteration = function (node) {
      let nodeName = node.nodeName;

      currentEdition = getCurrentEdition();

      if (currentEdition === 'diplomatic') {
         switch (nodeName) {
            case 'corr':
            case 'reg':
            case 'expan':
            case 'ex':
               iterateNode(node);
         }
      }
      if (currentEdition === 'interpretative') {
         switch (nodeName) {
            case 'sic':
            case 'orig':
            case 'abbr':
            case 'am':
               iterateNode(node);
         }
      }
      if(currentEdition === 'critical') {
         switch(nodeName) {
            case 'rdgGrp':
            case 'rdg':
               iterateNode(node);
         }
      }
   };


   /*** DIPLOMATIC/INTERPRETATIVE EDITION ***/

   /* *************************************** */
   /* BEGIN checkCurrentChoiceNode(node, doc) */
   /* ************************************************************************* */
   /* Function to check current choice node and create an array (EditionWords), */
   /* that contain diplomatic lectio and interpretative lectio                  */
   /* @node -> current node                                                     */
   /* @doc -> current xml document                                              */
   /* ************************************************************************* */
   let checkCurrentChoiceNode = function (node) {
      let word = {},
         children = node.children,
         childNode,
         childNodeName,
         nodeHaveChild,
         innerHtml,
         outerHtmlChild;

      for (let i = 0; i < children.length; i++) {
         childNodeName = children[i].nodeName;
         innerHtml = children[i].innerHTML;
         nodeHaveChild = children[i].children.length !== 0;

         if (nodeHaveChild) {
            for (let j = 0; j < children[i].children.length; j++) {
               outerHtmlChild = children[i].children[j].outerHTML;

               childNode = checkChildNode(children[i].children[j]);

               switch (childNodeName) {
                  case 'sic':
                  case 'orig':
                  case 'abbr':
                  case 'am':
                     if (childNode && childNode.nodeName === 'g') {
                        word.diplomatic = replaceGlyphTag(childNode, innerHtml, outerHtmlChild);
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
            switch (childNodeName) {
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
      return word;
   };


   /*** CRITICAL EDITION ***/

   /* ******************************* */
   /* BEGIN checkCurrentAppNode(node) */
   /* ********************************************************************** */
   /* Function to check current app node and create an array (EditionWords), */
   /* that contain critical lectio                                           */
   /* @node -> current node                                                  */
   /* ********************************************************************** */
   let checkCurrentAppNode = function (node, doc) {
      let word = {},
         children = node.children,
         child,
         childNodeName,
         nodeHaveChild,
         witness,
         witnesses = [],
         nodeHaveWit,
         witnessText;

      for (let i = 0; i < children.length; i++) {
         child = children[i];
         childNodeName = child.nodeName;

         if(childNodeName !== 'note') {
            witnessText = child.textContent;
            nodeHaveChild = children[i].children.length !== 0;

            if (nodeHaveChild && childNodeName !== 'rdg') {
               if(childNodeName === 'lem' && nodeHaveChild) {
                  witness = getCurrentWitness(child);
                  word = handleNestedApp(child, word);
               }
               else {
                  for (let j = 0; j < child.children.length; j++) {
                     witness = getCurrentWitness(child.children[j]);
                     childNodeName = child.children[j].nodeName;

                     if (childNodeName !== 'note') {
                        witnessText = child.children[j].textContent;

                        if (Object.keys(word).length === 0) {
                           word.critical = {[witness]: witnessText};
                        }
                        else {
                           word.critical[witness] = witnessText;
                        }
                     }
                  }
               }
            }
            else {
               witness = getCurrentWitness(child);
               witnessText = child.textContent;
               nodeHaveWit = witness;

               if(nodeHaveWit) {
                  witnesses = witness.split(' ');
                  for(let z = 0; z < witnesses.length; z++) {
                     Object.keys(word).length === 0 ? word.critical = {[witnesses[z]]: witnessText} : word.critical[witnesses[z]] = witnessText;
                  }
               }
            }
         }
      }
      return word;
   };

   /* ***************************** */
   /* BEGIN getCurrentWitness(node) */
   /* ************************************ */
   /* Function to get the current witness  */
   /* @node -> current node                */
   /* ************************************ */
   let getCurrentWitness = function (node) {
      let witList = {},
          group = [];

      if(node.getAttribute('wit')) {
         let wit = node.getAttribute('wit');

         while(wit.includes('#')) {
            wit = wit.replace('#', '');
         }

         if(wit === 'group') {
            wit = '';
            witList = parsedData.getWitnesses();
            group = witList.group.content;
            for (let i = 0; i < group.length; i++) {
               i !== group.length-1 ? wit += group[i] + ' ' : wit += group[i];
            }
         }
         return wit;
      }
      else {
         return false;
      }
   };

   /* ********************************* */
   /* BEGIN handleNestedApp(node, word) */
   /* *********************************************** */
   /* Function to handle nested apparatus             */
   /* @node -> current node                           */
   /* @word -> object containing the different lectio */
   /* *********************************************** */
   let handleNestedApp = function(node, word) {
      let innerHtml = node.innerHTML,
         nestedEl,
         nestedElInner,
         toReplace;

      for(let i = 0; i < node.children.length; i++) {
         nestedEl = node.children[i];

         switch(nestedEl.nodeName) {
            case 'app':
               toReplace = cleanSpace(nestedEl.outerHTML);
               nestedElInner = cleanSpace(nestedEl.innerHTML);
               innerHtml = cleanSpace(innerHtml);
               innerHtml = innerHtml.replace(toReplace, nestedElInner);

               word = checkCurrentAppNode(node);
               for(let j = 0; j < Object.keys(word.critical).length; j++) {
                  let wit = Object.keys(word.critical)[j];
                  let repl = innerHtml.replace(nestedElInner, word.critical[wit]);
                  word.critical[wit] = repl;
               }
         }
      }
      return word;
   };


   /*** NODE ***/

   /* **************************** */
   /* BEGIN checkCurrentNode(node) */
   /* **************************** */
   /* Function to check the current node name and add word to editionWords */
   /* @node -> current node                                                */
   /* ******************************************************************** */
   let checkCurrentNode = function(node, doc) {
      switch (node.nodeName) {
         case 'choice':
            currentChoiceNode = node;
            word = checkCurrentChoiceNode(node);
            editionWords.push(word);
            node = currentChoiceNode;
            break;
         case 'app':
            if(node.parentNode.nodeName !== 'lem') {
               currentAppNode = node;
               word = checkCurrentAppNode(node, doc);
               editionWords.push(word);
               node = currentAppNode;
            }
            break;
      }
   };

   /* ************************ */
   /* BEGIN iterateNode(node)  */
   /* *************************** */
   /* Function to iterate node    */
   /* @node -> current node       */
   /* *************************** */
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

   /* ****************************** */
   /* BEGIN checkNodeIteration(node) */
   /* ********************************** */
   /* Function to iterate specific nodes */
   /* @node -> current node              */
   /* ********************************** */
   let checkNodeIteration = function (node) {
      let nodeName = node.nodeName;

      switch (nodeName) {
         case 'note':
            iterateNode(node);
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
            case 'g', 'rdg':
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




   /* *************** */
   /* BEGIN addWord() */
   /* ************************************* */
   /* Function to add word in text (string) */
   /* ************************************* */
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

   /* **************** */
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
   /* ****************************************************** */
   /* Function to check if string (str) contains only spaces */
   /* @str -> string to check                                */
   /* ****************************************************** */
   let containOnlySpace = function(str) {
      return jQuery.trim(str).length === 0;
   };

   /* ******************** */
   /* BEGIN cleanText(str) */
   /* **************************************************************** */
   /* Function to clean text (string) from spaces and some punctuation */
   /* **************************************************************** */
   let cleanText = function (str) {
      str = cleanSpace(str);
      str = cleanPunctuation(str);
      return str;
   };

   /* ********************* */
   /* BEGIN cleanSpace(str) */
   /* ******************************************* */
   /* Function to clean text (string) from spaces */
   /* ******************************************* */
   let cleanSpace = function(str) {
      let replace;
      while(str.match(/\s\s/)){
         replace = str.replace(/\s\s/, " ");
         str = replace;
      }
      return str;
   };

   /* *************************** */
   /* BEGIN cleanPunctuation(str) */
   /* ***************************************************** */
   /* Function to clean text (string) from some punctuation */
   /* ***************************************************** */
   let cleanPunctuation = function(str) {
      let replace;
      while(str.match(regex)) {
         replace = str.replace(regex, "");
         str = replace;
      }
      return str;
   };

   return parser;
});
