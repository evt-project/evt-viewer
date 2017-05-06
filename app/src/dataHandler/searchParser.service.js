import * as JsSearch from 'js-search';
//import SearchApi from 'js-worker-search';

angular.module('evtviewer.dataHandler')

.service('evtSearchParser', function ($log) {
   let parser  =  {};
   console.log("SEARCH PARSER RUNNING");

   let glyph = '',
       glyphId = '',
       glyphNode,
       sRef = '',
       str = '',
       text = '';

  function nsResolver() {
    return "http://www.tei-c.org/ns/1.0";
  }

  let getGlyph = function(node) {
     let map = node.getElementsByTagName('mapping');
     for(let i = 0; i < map.length; i++) {
        if(map[i].getAttribute('type') === 'codepoint') {
           glyph = String.fromCharCode(map[i].textContent);
        }
     }
     return glyph;
  };

  let getGlyphNode = function(doc) {
     let path = "//charDecl/node()[not(self::comment())]";

     let nodes = doc.evaluate(path, doc, nsResolver, XPathResult.ANY_TYPE, null);
     let node = nodes.iterateNext();

     while(node) {
        if (node.tagName === 'glyph' || node.tagName === 'char') {
           glyphId = node.getAttribute('xml:id');
           if (glyphId === sRef) {
              glyphNode = node;
              return glyphNode;
           }
           else {
              node = nodes.iterateNext();
           }
        }
        else {
           node = nodes.iterateNext();
        }
     }
     return glyphNode;
  };

  let containOnlySpace = function() {
     return jQuery.trim(str).length === 0;
  };

  let getText = function(doc) {
     let path = "//body//node()[not(self::comment())]";

     /*var xpathResult = document.evaluate( xpathExpression, contextNode, namespaceResolver, resultType, result );*/
     let nodes = doc.evaluate(path, doc, nsResolver, XPathResult.ANY_TYPE, null);

     let node = nodes.iterateNext();
     str = node.nodeValue;

     while (node || node.nodeValue === null || containOnlySpace()) {
        if (node.tagName !== 'g' || !containOnlySpace()) {
           str = node.nodeValue;

           if (str !== null && !containOnlySpace()) {
              text += str;
           }
           node = nodes.iterateNext();

           if (node !== null) {
              str = node.nodeValue;
           }
           else {
              console.log("S: " + text);
              /*let test = document.getElementById('test');
              test.innerHTML = text;*/
              return text;
           }
        }
        else {
           sRef = node.getAttribute('ref');
           sRef = sRef.replace('#', '');

           glyphNode = getGlyphNode(doc);
           let g = getGlyph(glyphNode);
           text += g;
           node = nodes.iterateNext();
        }

        /*while(s.match(/\s\s/)){
         let replace = s.replace(/\s\s/, " ");
         s = replace;
         }*/
     }
  };

   parser.parseWords = function (doc) {
     let text = getText(doc);

     /*let tokenize = new JsSearch.SimpleTokenizer();
     let words = tokenize.tokenize(text);
     console.log(words);*/

     //const searchApi = new SearchApi();

     //var c = searchApi.indexDocument(doc);
     /*let c = searchApi.indexDocument('foo', 'Text describing an Object identified as "foo"');
     let d = searchApi.indexDocument('bar', 'Text describing an Object identified as "bar"');*/

     //const promise = searchApi.search('describing');
   };

   return parser;
});
