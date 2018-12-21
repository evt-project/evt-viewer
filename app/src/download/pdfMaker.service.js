angular.module('evtviewer.download')
.service('evtPdfMaker', function(config, parsedData, xmlParser) {
  var pdfMaker = {};

  const STYLES = {
    chapter: {
      pageBreak: 'after',
    },
    header: {},
    paragraph: {},
    ref: {
      bold: true,
      underline: true
    }
  };
  const FOOTER = function(currentPage) {
    return {text: currentPage, alignment: (currentPage % 2 === 0) ? 'left' : 'right'}
  };

  var docDefinition = {
    content: 'Test',
    footer: FOOTER,
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    styles: STYLES
  };

  pdfMaker.getPdf = function() {
    var title = config.indexTitle || 'Edition' + '.pdf';
   docDefinition.content = pdfMaker.createBodyContent();
    pdfMake.createPdf(docDefinition).download(title);
  };

  pdfMaker.createBodyContent = function() {
    var parsedText = parsedData.getCriticalText(config.mainDocId),
        textElem = parsedText ? xmlParser.parse(parsedText) : undefined,
        content = [];
    if (!textElem) { return; }
    textElem = textElem.getElementsByTagName('body')[0];
    pdfMaker.parseBodyContent(textElem, content);
    return content;
  };

  pdfMaker.parseBodyContent = function(elem, content) {
    angular.forEach(elem.childNodes, function(child) {
      if (child.nodeType === 3) {
        content.push(child.textContent);
      } else if (child.nodeType === 1) {
        console.log(child.tagName);
        switch(child.tagName) {
          case 'evt-named-entity-ref': {
          } break;
          case 'evt-reading': {
          } break;
          default: {
            if (child.children.length === 0) {
              content.push(child.textContent); 
            } else {
              pdfMaker.parseBodyContent(child, content);
            }
          }
        }
      }
    });
  }

  return pdfMaker;
});