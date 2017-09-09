//import * as JsSearch from 'js-search';
//import SearchApi from 'js-worker-search';
import 'jquery-xpath/jquery.xpath.js';

angular.module('evtviewer.dataHandler')

.service('evtSearchParser', function (evtInterface, evtGlyph) {
   var parser = {};
   console.log("SEARCH PARSER RUNNING");

   var text = '',
       nodes,
       node,

       currentEdition,
       currentGlyph,
       currentChoiceNode,
       currentAppNode,

       glyphs = [],

       word = {},
       editionWords = [];

   parser.parseWords = function (doc) {
      text = getText(doc);
   };

   var getText = function (doc) {
      currentEdition = getCurrentEdition();

      if(currentEdition === 'diplomatic') {
         nodes = $(doc).xpath("//body//(g | text()[normalize-space()])");

         for(var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if(node.nodeName === 'g') {
               currentGlyph = evtGlyph.getGlyph(node);
               glyphs = evtGlyph.addGlyphs(currentGlyph);
               text += evtGlyph.addGlyph(currentGlyph);
            }
            else {
               text += node.textContent;
            }
         }
      }
      else {
         //critical
      }
      text = cleanText(text);
      console.log(text);

     /* var path;
      var nsResolver = {
         lookupNamespaceURI: function (prefix) {
            prefix = 'ns';
            var namespace = doc.documentElement.namespaceURI;
            return namespace;
         }
      };

      doc.documentElement.namespaceURI == null ? path = '//body//(g | text()[normalize-space()]) ' : path = '//ns:body//text()[normalize-space()] | //ns:body//g';
      nodes = doc.evaluate(path, doc, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);*/

      /*for(var i = 0; i < nodes.snapshotLength; i++) {
         str += nodes.snapshotItem(i).textContent;
      }
      text = cleanText(str);
      console.log(text);*/

   };

   /*** EDITION ***/

   /* ************************* */
   /* BEGIN getCurrentEdition() */
   /* ******************************* */
   /* Function to get current Edition */
   /* ******************************* */
   var getCurrentEdition = function () {
      currentEdition = evtInterface.getState('currentEdition');
      return currentEdition;
   };

   /* **************************************** */
   /* BEGIN checkCurrentEditionIteration(node) */
   /* ************************************************************* */
   /* Function to iterate node that don't belong to current edition */
   /* @node -> current node                                         */
   /* ************************************************************* */
  /* var checkCurrentEditionIteration = function (node) {
      var nodeName = node.nodeName;

      currentEdition = getCurrentEdition();

      if (currentEdition === 'diplomatic') {
         switch (nodeName) {
            case 'corr':
            case 'reg':
            case 'expan':
            case 'ex':
               node = iterateNode(node);
         }
      }
      if (currentEdition === 'interpretative') {
         switch (nodeName) {
            case 'sic':
            case 'orig':
            case 'abbr':
            case 'am':
               node = iterateNode(node);
         }
      }
      if(currentEdition === 'critical') {
         switch(nodeName) {
            case 'rdgGrp':
            case 'rdg':
               node = iterateNode(node);
         }
      }
      return node;
   };*/


   /*** DIPLOMATIC/INTERPRETATIVE EDITION ***/

   /* *************************************** */
   /* BEGIN checkCurrentChoiceNode(node, doc) */
   /* ************************************************************************* */
   /* Function to check current choice node and create an array (EditionWords), */
   /* that contain diplomatic lectio and interpretative lectio                  */
   /* @node -> current node                                                     */
   /* @doc -> current xml document                                              */
   /* ************************************************************************* */
   /*var checkCurrentChoiceNode = function (node) {
      var word = {},
         children = node.children,
         childNode,
         childNodeName,
         nodeHaveChild,
         innerHtml,
         outerHtmlChild;

      for (var i = 0; i < children.length; i++) {
         childNodeName = children[i].nodeName;
         innerHtml = children[i].innerHTML;
         nodeHaveChild = children[i].children.length !== 0;

         if (nodeHaveChild) {
            for (var j = 0; j < children[i].children.length; j++) {
               outerHtmlChild = children[i].children[j].outerHTML;

               childNode = checkChildNode(children[i].children[j]);

               switch (childNodeName) {
                  case 'sic':
                  case 'orig':
                  case 'abbr':
                  case 'am':
                     if (childNode && childNode.nodeName === 'g') {
                        word.diplomatic = evtGlyph.replaceGlyphTag(node, childNode, innerHtml, outerHtmlChild);
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
   };*/


   /*** CRITICAL EDITION ***/

   /* ******************************* */
   /* BEGIN checkCurrentAppNode(node) */
   /* ********************************************************************** */
   /* Function to check current app node and create an array (EditionWords), */
   /* that contain critical lectio                                           */
   /* @node -> current node                                                  */
   /* ********************************************************************** */
   /*var checkCurrentAppNode = function (node, doc) {
      var word = {},
         children = node.children,
         child,
         childNodeName,
         nodeHaveChild,
         witness,
         witnesses = [],
         nodeHaveWit,
         witnessText;

      for (var i = 0; i < children.length; i++) {
         child = children[i];
         childNodeName = child.nodeName;

         if(childNodeName !== 'note') {
            var a = checkChildNode(child);
            witnessText = child.textContent;
            nodeHaveChild = children[i].children.length !== 0;

            if (nodeHaveChild && childNodeName !== 'rdg') {
               if(childNodeName === 'lem' && nodeHaveChild) {
                  witness = getCurrentWitness(child);
                  word = handleNestedApp(child, word);
               }
               else {
                  for (var j = 0; j < child.children.length; j++) {
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
                  for(var z = 0; z < witnesses.length; z++) {
                     Object.keys(word).length === 0 ? word.critical = {[witnesses[z]]: witnessText} : word.critical[witnesses[z]] = witnessText;
                  }
               }
            }
         }
      }
      return word;
   };*/

   /* ***************************** */
   /* BEGIN getCurrentWitness(node) */
   /* ************************************ */
   /* Function to get the current witness  */
   /* @node -> current node                */
   /* ************************************ */
   /*var getCurrentWitness = function (node) {
      var witList = {},
          group = [];

      if(node.getAttribute('wit')) {
         var wit = node.getAttribute('wit');

         while(wit.includes('#')) {
            wit = wit.replace('#', '');
         }

         if(wit === 'group') {
            wit = '';
            witList = parsedData.getWitnesses();
            group = witList.group.content;
            for (var i = 0; i < group.length; i++) {
               i !== group.length-1 ? wit += group[i] + ' ' : wit += group[i];
            }
         }
         return wit;
      }
      else {
         return false;
      }
   };*/

   /* ********************************* */
   /* BEGIN handleNestedApp(node, word) */
   /* *********************************************** */
   /* Function to handle nested apparatus             */
   /* @node -> current node                           */
   /* @word -> object containing the different lectio */
   /* *********************************************** */
   /*var handleNestedApp = function(node, word) {
      var innerHtml = node.innerHTML,
         nestedEl,
         nestedElInner,
         toReplace;

      for(var i = 0; i < node.children.length; i++) {
         nestedEl = node.children[i];

         switch(nestedEl.nodeName) {
            case 'app':
               toReplace = cleanSpace(nestedEl.outerHTML);
               nestedElInner = cleanSpace(nestedEl.innerHTML);
               innerHtml = cleanSpace(innerHtml);
               innerHtml = innerHtml.replace(toReplace, nestedElInner);

               word = checkCurrentAppNode(node);
               for(var j = 0; j < Object.keys(word.critical).length; j++) {
                  var wit = Object.keys(word.critical)[j];
                  var repl = innerHtml.replace(nestedElInner, word.critical[wit]);
                  word.critical[wit] = repl;
               }
         }
      }
      return word;
   };*/


   /*** NODE ***/

   /* **************************** */
   /* BEGIN checkCurrentNode(node) */
   /* **************************** */
   /* Function to check the current node name and add word to editionWords */
   /* @node -> current node                                                */
   /* ******************************************************************** */
   /*var checkCurrentNode = function(node, doc) {
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
      return node;
   };*/

   /* ************************ */
   /* BEGIN iterateNode(node)  */
   /* *************************** */
   /* Function to iterate node    */
   /* @node -> current node       */
   /* *************************** */
   /*var iterateNode = function(node) {
      var child;

         if (node.childNodes.length > 0) {
            for (var i = 0; i < node.childNodes.length; i++) {
               child = nodes.iterateNext();
               child = iterateNode(child);
            }
         }
         else {
            child = nodes.iterateNext();
         }
         return child;
   };*/

   /* ****************************** */
   /* BEGIN checkNodeIteration(node) */
   /* ********************************** */
   /* Function to iterate specific nodes */
   /* @node -> current node              */
   /* ********************************** */
   /*var checkNodeIteration = function (node) {
      var nodeName = node.nodeName;

      switch (nodeName) {
         case 'note':
         case 'del':
            iterateNode(node);
      }
   };*/

   /* ******************************* */
   /* BEGIN checkChildNode(childNode) */
   /* ********************************************************** */
   /* Function to check if childNodes contain a specific element */
   /* @childNode -> current childNode                            */
   /* ********************************************************** */
   /*var checkChildNode = function(childNode) {
      if(childNode.children.length === 0) {
         switch (childNode.nodeName) {
            case 'g', 'rdg':
               return childNode;
         }
      }
      else {
         for (var i = 0; i < childNode.children.length; i++) {
            childNode = childNode.children[i];
            checkChildNode(childNode);
         }
      }
      return childNode;
   };*/




   /* *************** */
   /* BEGIN addWord() */
   /* ************************************* */
   /* Function to add word in text (string) */
   /* ************************************* */
   /*var addWord = function() {
      var nextSibling = node.nextSibling,
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
   };*/

   /* **************** */
   /* BEGIN addSpace() */
   /* ************************************* */
   /* Function to add space where necessary */
   /* ************************************* */
   /*var addSpace = function() {
      var nextSibling = node.nextSibling,
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
   };*/

   /* *************************** */
   /* BEGIN containOnlySpace(str) */
   /* ****************************************************** */
   /* Function to check if string (str) contains only spaces */
   /* @str -> string to check                                */
   /* ****************************************************** */
   /*var containOnlySpace = function(str) {
      return jQuery.trim(str).length === 0;
   };*/

   /* ******************** */
   /* BEGIN cleanText(str) */
   /* **************************************************************** */
   /* Function to clean text (string) from spaces and some punctuation */
   /* **************************************************************** */
   var cleanText = function (str) {
      str = cleanSpace(str);
      str = cleanPunctuation(str);
      return str;
   };

   /* ********************* */
   /* BEGIN cleanSpace(str) */
   /* ******************************************* */
   /* Function to clean text (string) from spaces */
   /* ******************************************* */
   var cleanSpace = function(str) {
      var replace,
          regex = /\s\s/;
      while(str.match(regex)){
         replace = str.replace(regex, " ");
         str = replace;
      }
      return str;
   };

   /* *************************** */
   /* BEGIN cleanPunctuation(str) */
   /* ***************************************************** */
   /* Function to clean text (string) from some punctuation */
   /* ***************************************************** */
   var cleanPunctuation = function(str) {
      var replace,
          regex = /[.,\/#!$%\^&\*;:{}=\-_`~()<>]/;

      while(str.match(regex)) {
         replace = str.replace(regex, "");
         str = replace;
      }
      return str;
   };

   return parser;
});
