import 'jquery-xpath/jquery.xpath.js';

/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtCriticalParser
 * @description
 * # evtSearchParser
 * In this service are defined and exposed methods to handle search feature.
 *
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.dataHandler.evtGlyph
 */
angular.module('evtviewer.dataHandler')

.service('evtSearchParser', function (evtInterface, evtGlyph) {
   var parser = {};

   var text = '',
       currentEdition,
       editionWords = [];

   var namespace = false,
       nsResolver;

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtSearchParser#parseText
    * @methodOf evtviewer.dataHandler.evtSearchParser
    *
    * @description
    * This method will get the text of a specific XML document.
    *
    * @param {element} doc XML element to be parsed
    *
    * @author GC
    */
   parser.getText = function (doc) {
      namespace = checkNamespace(doc, namespace);

      currentEdition = getCurrentEdition();

      switch(currentEdition) {
         case 'diplomatic':
         case 'interpretative':
            text = parser.parseDiplomaticInterpretativeText(doc, currentEdition);
            break;
         case 'critical':
            text = parser.parseCriticalText(doc);
            break;
      }

      editionWords = parser.parseDiplomaticInterpretativeLectio(doc);
      console.log(editionWords);

      text = cleanPunctuation(text);
      text = $(doc).xpath("normalize-space('" + text + "')")[0];
      console.log(text);
   };

   parser.parseDiplomaticInterpretativeText = function (doc, currentEdition) {
      var nodes,
          node,
          currentGlyph;

      switch(currentEdition) {
         case 'diplomatic':
            nodes = namespace ? $(doc).xpath("//ns:body//(ns:g | text())[not((ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex))]", nsResolver)
                              : $(doc).xpath("//body//(g | text())[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex))]");
            break;
         case 'interpretative':
            nodes = namespace ? $(doc).xpath("//ns:body//(ns:g | text())[not((ancestor::ns:sic|ancestor::ns:orig|ancestor::ns:abbr|ancestor::ns:am))]", nsResolver)
                              : $(doc).xpath("//body//(g | text())[not((ancestor::sic|ancestor::orig|ancestor::abbr|ancestor::am))]");
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

      nodes = namespace ? $(doc).xpath('//ns:choice', nsResolver) : $(doc).xpath('//choice');

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
          diplomaticNodes;

      diplomaticNodes = namespace ? $(currentNode).xpath('.//(child::text()[normalize-space()][(ancestor::ns:sic|ancestor::ns:orig|ancestor::ns:abbr|ancestor::ns:am)] | ns:g)', nsResolver)
                                  : $(currentNode).xpath('.//(child::text()[normalize-space()][(ancestor::sic|ancestor::orig|ancestor::abbr|ancestor::am)] | g)');

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
      var interpretativeNodes;

      interpretativeNodes = namespace ? $(currentNode).xpath('.//child::text()[normalize-space()][(ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex)]', nsResolver)
                                      : $(currentNode).xpath('.//child::text()[normalize-space()][(ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex)]');

      for (var i = 0; i < interpretativeNodes.length; i++) {
         word.interpretative += interpretativeNodes[i].textContent;
      }
      word.interpretative = cleanText(word.interpretative);
      return word;
   };

   var getCurrentEdition = function () {
      currentEdition = evtInterface.getState('currentEdition');
      return currentEdition;
   };

   parser.parseCriticalText = function (doc) {
      var nodes,
          node;

      nodes = namespace ? $(doc).xpath("//ns:body//text()", nsResolver) : $(doc).xpath("//body//text()");

      for(var i = 0; i < nodes.length; i++) {
         node = nodes[i];
         text += node.textContent;
      }
      return text;
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

   /*TODO: Move this functions in Utils*/
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

   var checkNamespace = function(doc, namespace) {
      var ns = doc.documentElement.namespaceURI;
      if(ns !== null) {
         namespace = true;
         nsResolver = function(prefix) {
            if(prefix === 'ns') {
               return doc.documentElement.namespaceURI;
            }
         };
      }
      return namespace;
   };

   return parser;
});
