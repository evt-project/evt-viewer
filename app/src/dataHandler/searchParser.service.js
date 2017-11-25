import "jquery-xpath/jquery.xpath.js";
var lunr = require("lunr");

/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtSearchParser
 * @description
 * # evtSearchParser
 * In this service are defined and exposed methods to handle search feature.
 *
 * @requires evtviewer.dataHandler.evtGlyph
 */
angular.module("evtviewer.dataHandler")

.service("evtSearchParser", function(evtGlyph) {
   var evtSearchParser = {};

   var namespace = false,
       nsResolver;

   var lines = [];

   /**
    * @ngdoc method
    * @name evtviewer.dataHandler.evtSearchParser#parseDocument
    * @methodOf evtviewer.dataHandler.evtSearchParser
    *
    * @description
    * This method will get the text of a specific XML document.
    *
    * @param {element} doc XML element to be parsed
    * @param {element} currentEdition XML element to be parsed
    *
    * @author GC
    */
   evtSearchParser.parseDocument = function (doc, currentEdition) {
      console.log("SEARCH PARSER RUNNING!");

      namespace = checkNamespace(doc, namespace);

      switch(currentEdition) {
         case 'diplomatic':
         case 'interpretative':
            parseLines(doc, lines, currentEdition);
            break;
         case 'critical':
            break;
      }

      console.log(lines);
   };

   evtSearchParser.createIndex = function(lines) {

      var idx = lunr(function () {
         this.ref('line')
         this.field('text')
         this.metadataWhitelist = ['position']

         for (var i = 0; i < lines.length; i++)
         {
            var doc = lines[i];
            this.add(doc);
         }
      });

      var search = idx.search("secgan");
   };

   var parseLines = function(doc, lines, currentEdition) {
      lines = getLines(doc, currentEdition);
      return lines;
   };

   var getLines = function(doc, currentEdition) {
      var lineNodes,
          line;

      line = {
        line: "",
        text: ""
      };

      lineNodes = getLineNodes(doc);

      for (var i = 0; i < lineNodes.length; i++) {
         line.line = lineNodes[i].line;
         line.text = addLineContent(lineNodes[i], line, currentEdition);
         lines.push(line);
         line = {};
      }
      return lines;
   };

   var getLineNodes = function(doc) {
      var l,
          line = {},
          lineNodes = [],
          linesNodes;

      linesNodes = namespace ? $(doc).xpath("//ns:body//ns:l", nsResolver)
         : $(doc).xpath("//body//l");

      for(var i = 0; i < linesNodes.length; i++) {
         l = linesNodes[i];
         line.line = $(l).xpath("string(@n)")[0];
         line.nodes = namespace ? $(l).xpath(".//(ns:g | text())[not((ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex))]", nsResolver)
                                : $(l).xpath(".//(g | text())[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex))]");
         lineNodes.push(line);
         line = {};
      }
      return lineNodes;
   };

   var addLineContent = function(lineNodes, line, currentEdition) {
      var currentGlyph;
      var nodes = lineNodes.nodes;

      for(var i = 0; i < nodes.length; i++) {
         if(nodes[i].nodeName === 'g') {
            currentGlyph = evtGlyph.getGlyph(nodes[i]);
            line.text += evtGlyph.addGlyph(currentGlyph, currentEdition);
         }
         else {
            line.text += nodes[i].textContent;
         }
      }
      return line.text;
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

return evtSearchParser;
});
