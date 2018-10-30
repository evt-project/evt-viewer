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
        endIdIndex = Object.values(depaEndIds).indexOf(elemId),
        startIdIndex = Object.values(depaStartIds).indexOf(elemId),
        entry, position;
    // E se uno stesso anchor viene usato per più entry?
    if (elemId && endIdIndex >= 0) {
      entry = parsedData.getCriticalEntryById(Object.keys(depaEndIds)[endIdIndex]);
      position = 'start';
    }
    if (elemId && startIdIndex >= 0) {
      entry = parsedData.getCriticalEntryById(Object.keys(depaStartIds)[startIdIndex]);
      position = 'end';
    }
    if (entry && position) {
      var spanElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit, position)
      : evtCriticalElementsParser.getEntryLemmaText(entry, wit, position);
      spanElement.setAttribute('data-position', position);
      var method = parsedData.getEncodingDetail('variantEncodingMethod');
      spanElement.setAttribute('data-method', method);
      var endId = depaEndIds[entry.id], startId = depaStartIds[entry.id];
      if (endId === startId && (!spanElement.firstChild || spanElement.firstChild.className !== 'emptyText')) {
        elem.parentNode.replaceChild(spanElement, elem);
      } else if (endId === startId) {
        elem.parentNode.insertBefore(spanElement, elem.nextSibling);
        var startElem = spanElement.cloneNode(true);
        startElem.setAttribute('data-position', 'start');
        elem.parentNode.insertBefore(startElem, elem);
      } else if (!spanElement.firstChild || spanElement.firstChild.className !== 'emptyText') {
        var domString = dom.outerHTML
      } else {
        if (position === 'start') {
          elem.parentNode.insertBefore(spanElement, elem);
        } else {
          elem.parentNode.insertBefore(spanElement, elem.nextSibling);
        }
      }
    }
  };

  parser.getLemma = function(entry, doc) {
    var lemma = '',
        depaStartIds = parsedData.getCriticalEntries()._indexes.depa.start,
        depaEndIds = parsedData.getCriticalEntries()._indexes.depa.end,
        startId = depaStartIds[entry.id],
        endId = depaEndIds[entry.id],
        location = parsedData.getEncodingDetail('variantEncodingLocation');
    if (startId) {
      if (startId === endId) {
        var matches = doc.find('*'),
            found = false,
            index = 0;
        while (!found && index < matches.length) {
          var elem = matches[index];
          if (elem.attributes && elem.hasAttribute('xml:id') && elem.getAttribute('xml:id') === startId) {
            lemma = elem.outerHTML;
            found = true;
          }
          index++;
        }
      } else {
        var docString = doc[0].documentElement.outerHTML;
        var startPos = docString.search('xml:id="' + startId),
            endPos = 0;
        if (location === 'internal') {
          var string = entry._xmlSource.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
          endPos = docString.search(string);
        } else {
          endPos = docString.search('xml:id="' + endId + '"');
        }
        lemma = docString.substring(startPos, endPos);
        lemma = lemma.substring(lemma.indexOf('>') + 1);
        if (location === 'external') {
          lemma = lemma.substring(0, lemma.lastIndexOf('<'));
        }
      }
      lemma = lemma.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '').trim();
      parser.parseLemma(entry, lemma);
    }
  };

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