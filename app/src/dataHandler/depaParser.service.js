angular.module('evtviewer.dataHandler')

.service('evtDepaParser', function(parsedData, evtCriticalElementsParser, Utils) {
  var parser = {};

  parser.setElementInText = function(elem, wit, dom) {
    if (!parsedData.getCriticalEntries()._indexes.depa) {
      return;
    }
    var depaEndIds = parsedData.getCriticalEntries()._indexes.depa.end,
        depaStartIds = parsedData.getCriticalEntries()._indexes.depa.start,
        elemId = elem.getAttribute('xml:id'),
        ids = Object.values(depaStartIds).concat(Object.values(depaEndIds));
    if (ids.indexOf(elemId) < 0) {
      return;
    }
    var entry,
        startEntryIds = Object.keys(depaStartIds).filter(key => { return depaStartIds[key] === elemId }) || [],
        endEntryIds = Object.keys(depaEndIds).filter(key => { return depaEndIds[key] === elemId }) || [];
    startEntryIds.forEach(entryId => {
      entry = parsedData.getCriticalEntryById(entryId);
      if (entry) {
        var rdgElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit, 'start')
          : evtCriticalElementsParser.getEntryLemmaText(entry, wit, 'start');
        var method = parsedData.getEncodingDetail('variantEncodingMethod');
        rdgElement.setAttribute('data-method', method);
        var anchorElement = document.createElement('span');
        anchorElement.setAttribute('data-app-id', entry.id);
        anchorElement.setAttribute('class', 'depaAnchor');
        anchorElement.setAttribute('id', 'depaAnchor-' + entry.id + '-' + wit);
        var depaContent = document.createTextNode('*DEPA ANCHOR*');
        anchorElement.appendChild(depaContent);
        var startId = depaStartIds[entryId], endId = depaEndIds[entryId];
        // The apparatus entry has no text for the current doc
        if (endId === startId && (rdgElement.firstChild && rdgElement.firstChild.className !== 'emptyText')) {
          var index = elem.childNodes.length - 1;
          while (index >= 0) {
            elem.removeChild(elem.childNodes[index]);
            index--;           
          }
          elem.appendChild(rdgElement);
        } else {
          // The apparatus entry refers to multiple nodes
          var fromAnchor = dom.querySelector('[*|id="' + startId + '"]'),
              toAnchor = dom.querySelector('[*|id="' + endId + '"]');
          if (rdgElement.firstChild && rdgElement.firstChild.className !== 'emptyText') {
            var elems = Utils.DOMutils.getElementsBetweenTree(fromAnchor, toAnchor);
            elems.forEach(el => {
              el.parentNode.removeChild(el);
            });
            if (elem.childNodes && elem.childNodes.length > 0) {
              elem.insertBefore(rdgElement, elem.firstChild);
            } else {
              elem.parentNode.insertBefore(rdgElement, elem.nextSibling);
            }
          } else {
            var span = document.createElement('span');
            span.setAttribute('class', 'depaContent');
            span.setAttribute('id', 'depaContent-' + entry.id + '-' + wit);
            var range = document.createRange();
            try {
              range.setStart(fromAnchor, 0);
              range.setEnd(toAnchor, 0);
              if (range.collapsed) {
                range.selectNode(fromAnchor);
              }
              range.surroundContents(span);
            } catch(e) {
              var elems = Utils.DOMutils.getElementsBetweenTree(fromAnchor, toAnchor);
              elems.forEach(el => {
                if (el.type === 3) {
                  var span = document.createElement('span');
                  span.setAttribute('class', 'depaContent');
                  span.textContent = el.textContent;
                  el.parentNode.replaceChild(span, el);
                } else if (el.className && el.className.indexOf('depaContent') < 1) {
                  el.className += ' depaContent';
                }
              });
            }            
            if (elem.childNodes && elem.childNodes.length > 0) {
              elem.insertBefore(anchorElement, elem.firstChild);
            } else {
              elem.parentNode.insertBefore(anchorElement, elem.nextSibling);
            }
          }
        }
      }
    });
    endEntryIds.forEach(entryId => {
      entry = parsedData.getCriticalEntryById(entryId);
      if (entry) {
        var rdgElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit, 'end')
          : evtCriticalElementsParser.getEntryLemmaText(entry, wit, 'end');
        var method = parsedData.getEncodingDetail('variantEncodingMethod');
        rdgElement.setAttribute('data-method', method);
        rdgElement.setAttribute('data-overlap', true);
        if (rdgElement.firstChild && rdgElement.firstChild.className === 'emptyText') {
          if (elem.childNodes && elem.childNodes.length > 0) {
            elem.insertBefore(rdgElement, elem.lastChild);
          } else {
            elem.parentNode.insertBefore(rdgElement, elem);
          }
        }
      }
    });
  };

  parser.getAppContentRange = function(startId, endId, dom) {
    var fromAnchor = dom.querySelector('[*|id="' + startId + '"]');
    var toAnchor = dom.querySelector('[*|id="' + endId + '"]');
    var range = document.createRange();
    try {
      range.setStart(fromAnchor, 0);
      range.setEnd(toAnchor, 0);
    } catch (e) { console.log(e); }
    return range;
  }

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