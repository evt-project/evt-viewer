angular.module('evtviewer.dataHandler')

.service('evtDepaParser', function(parsedData, evtCriticalElementsParser, evtParser, xmlParser, config) {
  var parser = {};

  parser.setElementInText = function(elem, wit, dom) {
    if (!parsedData.getCriticalEntries()._indexes.depa) {
      return;
    }
    var depaEndIds = parsedData.getCriticalEntries()._indexes.depa.end,
        depaStartIds = parsedData.getCriticalEntries()._indexes.depa.start,
        elemId = elem.getAttribute('xml:id'),
        entry, position,
        ids = Object.values(depaStartIds).concat(Object.values(depaEndIds));
    if (ids.indexOf(elemId) < 0) {
      return;
    }
    var startEntryIds = Object.keys(depaStartIds).filter(key => { return depaStartIds[key] === elemId }) || [];
    var endEntryIds = Object.keys(depaEndIds).filter(key => { return depaEndIds[key] === elemId }) || [];
    position = 'start';
    startEntryIds.forEach(entryId => {
      entry = parsedData.getCriticalEntryById(entryId);
      if (entry) {
        var spanElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit, position)
          : evtCriticalElementsParser.getEntryLemmaText(entry, wit, position);
        spanElement.setAttribute('data-position', position);
        var method = parsedData.getEncodingDetail('variantEncodingMethod');
        spanElement.setAttribute('data-method', method);
        var startId = depaStartIds[entryId], endId = depaEndIds[entryId];
        if (endId === startId && (!spanElement.firstChild || spanElement.firstChild.className !== 'emptyText')) {
          var index = elem.childNodes.length - 1;
          while (index >= 0) {
            elem.removeChild(elem.childNodes[index]);
            index--;           
          }
          spanElement.setAttribute('data-position', 'end');
          elem.appendChild(spanElement);
        } else if (!spanElement.firstChild || spanElement.firstChild.className !== 'emptyText') {
          // TODO-POLO: substitute text?
          // var domString = dom.outerHTML,
          //     subst = parser.findReadingString(domString, endId, startId, entry);
          // var newString = dom.outerHTML.replace(subst, spanElement.outerHTML);
          // dom = xmlParser.parse(newString).getElementsByTagName('body')[0];
          spanElement.setAttribute('data-overlap', true);
          if (elem.childNodes && elem.childNodes.length > 0) {
            elem.insertBefore(spanElement, elem.firstChild);
          } else {
            elem.parentNode.insertBefore(spanElement, elem.nextSibling);
          }
        } else {
          if (elem.childNodes && elem.childNodes.length > 0) {
            elem.insertBefore(spanElement, elem.firstChild);
          } else {
            elem.parentNode.insertBefore(spanElement, elem.nextSibling);
          }
        }
      }
    });
    position = 'end';
    endEntryIds.forEach(entryId => {
      entry = parsedData.getCriticalEntryById(entryId);
      if (entry) {
        var spanElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit, position)
          : evtCriticalElementsParser.getEntryLemmaText(entry, wit, position);
        spanElement.setAttribute('data-position', position);
        var method = parsedData.getEncodingDetail('variantEncodingMethod');
        spanElement.setAttribute('data-method', method);
        var startId = depaStartIds[entryId], endId = depaEndIds[entryId];
        if (spanElement.firstChild && spanElement.firstChild.className === 'emptyText') {
          if (elem.childNodes && elem.childNodes.length > 0) {
            elem.insertBefore(spanElement, elem.lastChild);
          } else {
            elem.parentNode.insertBefore(spanElement, elem);
          }
        } else if (endId !== startId) {
          spanElement.setAttribute('data-overlap', true);
          if (elem.childNodes && elem.childNodes.length > 0) {
            elem.insertBefore(spanElement, elem.lastChild);
          } else {
            elem.parentNode.insertBefore(spanElement, elem);
          }
        }
      }
    });
  };

  parser.getInternalDepaAppSpanElement = function(entry, wit, doc) {
    var spanElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit, position)
    : evtCriticalElementsParser.getEntryLemmaText(entry, wit, position);
    spanElement.setAttribute('data-method', 'double-end-point');
    var startElem = spanElement.cloneNode(true);
    spanElement.setAttribute('data-position', 'end');
    startElem.setAttribute('data-position', 'start');
    var startNode = doc.querySelector('[*|id=' + from + ']'),
        from = entry.attributes['from'],
        to = entry.attributes['to'];
    if (from === to && (!spanElement.firstChild || spanElement.firstChild.className !== 'emptyText')) {
      var index = startNode.childNodes.length - 1;
      while (index >= 0) {
        startNode.removeChild(startNode.childNodes[index]);
        index--;           
      }
      startNode.appendChild(spanElement);
      return;
    } else if (startNode && startNode.childNodes && startNode.childNodes.length > 0) {
      startNode.insertBefore(startElem, startNode.firstChild);
    } else {
      startNode.parentNode.insertBefore(startElem, startNode.nextSibling);
    }
    return spanElement;
  };

  parser.getLemma = function(entry, doc) {
    var dom = doc[0].documentElement;
    var lemma = '',
        depaStartIds = parsedData.getCriticalEntries()._indexes.depa.start,
        depaEndIds = parsedData.getCriticalEntries()._indexes.depa.end,
        startId = depaStartIds[entry.id],
        endId = depaEndIds[entry.id];
    if (startId) {
      if (startId === endId) {
        var elem = dom.querySelector('[*|id=' + startId + ']')[0];
        if (elem) {
          lemma = elem.outerHTML;
        }
      } else {
        var docString = dom.outerHTML;
        lemma = parser.findReadingString(docString, endId, startId, entry);        
      }
      lemma = lemma.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '').trim();
      parser.parseLemma(entry, lemma);
    }
  };

  parser.findReadingString = function(docString, endId, startId, entry) {
    var startPos = docString.search('xml:id="' + startId),
        endPos = 0,
        location = parsedData.getEncodingDetail('variantEncodingLocation'),
        readingString;
    if (location === 'internal') {
      var string = entry._xmlSource.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
      endPos = docString.search(string);
    } else {
      endPos = docString.search('xml:id="' + endId + '"');
    }
    readingString = docString.substring(startPos, endPos);
    readingString = readingString.substring(readingString.indexOf('>') + 1);
    if (location === 'external') {
      readingString = readingString.substring(0, readingString.lastIndexOf('<'));
    }
    return readingString;
  }

  parser.parseLemma = function(entry, lemma) {
    var parsedLemma = {
      id: entry.id + '-depa-lem',
      attributes: [],
      content: [lemma],
      note: '',
      _significant: true,
      _group: undefined,
      _xmlTagName: '',
      _xmlSource: lemma
    };
    entry.content[parsedLemma.id] = parsedLemma;
    entry.lemma = parsedLemma.id;
  }

  return parser;
});