import 'jquery-xpath/jquery.xpath.js';

angular.module('evtviewer.dataHandler')

.service('evtSearchParser', function (evtInterface, evtGlyph) {
   var parser = {};
   console.log("SEARCH PARSER RUNNING");

   var text = '',
       currentEdition,
       editionWords = [];

   parser.parseText = function (doc) {
      currentEdition = getCurrentEdition();

      switch(currentEdition) {
         case 'diplomatic':
         case 'interpretative':
            text = parser.parseDiplomaticInterpretativeText(doc, currentEdition);
            break;
         case 'critical':
            break;
      }

      editionWords = parser.parseDiplomaticInterpretativeLectio(doc);
      console.log(editionWords);

      text = cleanText(text);
      console.log(text);
   };

   parser.parseDiplomaticInterpretativeText = function (doc, currentEdition) {
      var nodes,
          node,
          currentGlyph;

      switch(currentEdition) {
         case 'diplomatic':
            nodes = $(doc).xpath("//body//(g | text())[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex))]");
            break;
         case 'interpretative':
            nodes = $(doc).xpath("//body//(g | text())[not((ancestor::sic|ancestor::orig|ancestor::abbr|ancestor::am))]");
            break;
      }

      for(var i = 0; i < nodes.length; i++) {
         node = nodes[i];

         if(node.nodeName === 'g') {
            currentGlyph = evtGlyph.getGlyph(node);
            text += evtGlyph.addGlyph(currentGlyph);
         }
         else {
            text += node.textContent;
         }
      }
      return text;
   };

   parser.parseDiplomaticInterpretativeLectio = function(doc) {
      var nodes,
          currentNode,
          word = {};


      nodes = $(doc).xpath('//choice');
      for(var i = 0; i < nodes.length; i++) {
         word.diplomatic = '';
         word.interpretative = '';
         currentNode = nodes[i];

         getDiplomaticLectio(word, currentNode);
         getInterpretativeLectio(word, currentNode);

         editionWords.push(word);
         word = {};
      }
      return editionWords;
   };

   var getDiplomaticLectio = function(word, currentNode) {
      var glyph,
          diplomaticNodes = $(currentNode).xpath('.//(child::text()[normalize-space()][(ancestor::sic|ancestor::orig|ancestor::abbr|ancestor::am)] | g)');

      for (var i = 0; i < diplomaticNodes.length; i++) {
         if(diplomaticNodes[i].nodeName === 'g') {
            glyph = evtGlyph.getCurrentGlyph(diplomaticNodes[i]);
            word.diplomatic += glyph.diplomatic.content;
         }
         else {
            word.diplomatic += diplomaticNodes[i].textContent;
         }
      }
      word.diplomatic = cleanText(word.diplomatic);
      return word;
   };

   var getInterpretativeLectio = function(word, currentNode) {
      var interpretativeNodes = $(currentNode).xpath('.//child::text()[normalize-space()][(ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex)]');

      for (var i = 0; i < interpretativeNodes.length; i++) {
         word.interpretative += interpretativeNodes[i].textContent;
      }
      word.interpretative = cleanText(word.interpretative);
      return word;
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


   /* **************** */
   /* BEGIN addSpace() */
   /* ************************************* */
   /* Function to add space where necessary */
   /* ************************************* */
   var addSpace = function(node) {
      var test = $(node).xpath('./ancestor::choice');

      var parentNode = node.parentNode,
          nextSibling = node.nextSibling;

      if(test.length > 0) {
         text += ' ';
      }
   };

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
      str = cleanPunctuation(str);
      str = cleanSpace(str);
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
          regex = /[.,\/#!$%\^&\*;:{}=\-_`~()]/;

      while(str.match(regex)) {
         replace = str.replace(regex, "");
         str = replace;
      }
      return str;
   };

   return parser;
});
