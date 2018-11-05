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
        var rdgElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit, position)
          : evtCriticalElementsParser.getEntryLemmaText(entry, wit, position);
        var method = parsedData.getEncodingDetail('variantEncodingMethod');
        rdgElement.setAttribute('data-method', method);
        var spanElement = document.createElement('span');
        spanElement.setAttribute('data-app-id', entry.id);
        spanElement.setAttribute('class', 'depaAnchor');
        spanElement.setAttribute('id', 'depaAnchor-' + entry.id);
        var startId = depaStartIds[entryId], endId = depaEndIds[entryId];
        if (endId === startId && (!rdgElement.firstChild || rdgElement.firstChild.className !== 'emptyText')) {
          var index = elem.childNodes.length - 1;
          while (index >= 0) {
            elem.removeChild(elem.childNodes[index]);
            index--;           
          }
          elem.appendChild(rdgElement);
        } else if (!rdgElement.firstChild || rdgElement.firstChild.className !== 'emptyText') {
          // OPTION 1: substituting the text
          var fromAnchor = dom.querySelector('[*|id="' + startId + '"]');
          var toAnchor = dom.querySelector('[*|id="' + endId + '"]');
          var range = document.createRange();
          try {
            range.setStart(fromAnchor, 0);
            range.setEnd(toAnchor, 0);
          } catch (e) { console.log(e); }
          range.deleteContents();
          range.insertNode(rdgElement);
          // OPTION 2: keeping the text and adding the start anchor
          // if (elem.childNodes && elem.childNodes.length > 0) {
          //   elem.insertBefore(spanElement, elem.firstChild);
          // } else {
          //   elem.parentNode.insertBefore(spanElement, elem.nextSibling);
          // }
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
        var rdgElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit, position)
          : evtCriticalElementsParser.getEntryLemmaText(entry, wit, position);
        var method = parsedData.getEncodingDetail('variantEncodingMethod');
        rdgElement.setAttribute('data-method', method);
        rdgElement.setAttribute('data-overlap', true);
        var startId = depaStartIds[entryId], endId = depaEndIds[entryId];
        if (rdgElement.firstChild && rdgElement.firstChild.className === 'emptyText') {
          if (elem.childNodes && elem.childNodes.length > 0) {
            elem.insertBefore(rdgElement, elem.lastChild);
          } else {
            elem.parentNode.insertBefore(rdgElement, elem);
          }
        }
        // OPTION 2: adding the end anchor
        // else if (endId !== startId) {
          // if (elem.childNodes && elem.childNodes.length > 0) {
          //   elem.insertBefore(rdgElement, elem.lastChild);
          // } else {
          //   elem.parentNode.insertBefore(rdgElement, elem);
          // }
        // }
      }
    });
  };

  parser.getInternalDepaAppSpanElement = function(entry, wit, doc) {
    var position = 'end';
    var spanElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit, position)
    : evtCriticalElementsParser.getEntryLemmaText(entry, wit, position);
    spanElement.setAttribute('data-method', 'double-end-point');
    var startElem = spanElement.cloneNode(true);
    spanElement.setAttribute('data-position', 'end');
    startElem.setAttribute('data-position', 'start');
    var from = entry.attributes['from'].replace('#', ''),
        to = entry.attributes['to'] ? entry.attributes['to'].replace('#', '') : null,
        startNode = doc.querySelector('[*|id=' + from + ']');
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
    doc = doc.documentElement || doc;
    var lemma = '',
        depaStartIds = parsedData.getCriticalEntries()._indexes.depa.start,
        depaEndIds = parsedData.getCriticalEntries()._indexes.depa.end,
        startId = depaStartIds[entry.id],
        endId = depaEndIds[entry.id];
    if (startId) {
      if (startId === endId) {
        var elem = doc.querySelector('[*|id=' + startId + ']');
        if (elem) {
          lemma = elem.innerHTML;
        }
      } else {
        var docString = doc.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
        lemma = parser.findReadingString(docString, endId, startId, entry);
      }
      lemma = lemma.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '').trim();
      parser.parseLemma(entry, lemma);
    }
  };

  parser.findReadingString = function(docString, endId, startId, entry) {
    var startPos = docString.indexOf('xml:id="' + startId),
        endPos = 0,
        location = parsedData.getEncodingDetail('variantEncodingLocation'),
        readingString;
    if (location === 'internal') {
      var string = entry._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
      endPos = docString.indexOf(string, startPos);
    } else {
      endPos = docString.indexOf('xml:id="' + endId + '"');
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