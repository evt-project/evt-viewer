angular.module('evtviewer.dataHandler')

.service('evtDepaParser', function(parsedData, evtCriticalElementsParser, Utils, evtParser, config) {
  var parser = {};

  var apparatusEntryDef = '<app>',
		lemmaDef = '<lem>',
		readingDef = lemmaDef + ', <rdg>',
		readingGroupDef = '<rdgGrp>',
		quoteDef = config.quoteDef,
		analogueDef = config.analogueDef,
	  skipFromBeingParsed = '<evt-reading>,<pb>,' + apparatusEntryDef + ',' + readingDef + ',' + readingGroupDef + ',' + quoteDef + ',' + analogueDef + ',<evt-quote>,<evt-analogue>,<evt-version-reading>';

  parser.setElementInText = function(elem, wit, dom) {
    if (!parsedData.getCriticalEntries()._indexes.depa) {
      return;
    }
    var depaStartIds = parsedData.getCriticalEntries()._indexes.depa.start,
        depaEndIds = parsedData.getCriticalEntries()._indexes.depa.end,
        elemId = elem.getAttribute('xml:id');
    if (Object.values(depaStartIds).indexOf(elemId) < 0) {
      return;
    }
    var entry,
        startEntryIds = Object.keys(depaStartIds).filter(key => { return depaStartIds[key] === elemId }) || [];
    startEntryIds.forEach(entryId => {
      entry = parsedData.getCriticalEntryById(entryId);
      if (entry) {
        var rdgElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit, true)
          : evtCriticalElementsParser.getEntryLemmaText(entry, wit, true);
        var method = parsedData.getEncodingDetail('variantEncodingMethod');
        rdgElement.setAttribute('data-method', method);

        var startId = depaStartIds[entryId], endId = depaEndIds[entryId],
            fromAnchor = dom.querySelector('[*|id="' + startId + '"]'),
            toAnchor = dom.querySelector('[*|id="' + endId + '"]');
        // If the text needs to be substitute by the entry
        if (rdgElement.firstChild && rdgElement.firstChild.className !== 'emptyText') {
          if (startId === endId) {
            index = fromAnchor.childNodes.length - 1;
            while (index >= 0) {
              fromAnchor.removeChild(fromAnchor.childNodes[index]);
              index--;
            }
          } else {
            var elems = Utils.DOMutils.getElementsBetweenTree(fromAnchor, toAnchor);
            elems.forEach(el => {
              el.parentNode.removeChild(el);
            });
          }
          if (elem.childNodes && elem.childNodes.length > 0) {
            elem.insertBefore(rdgElement, elem.firstChild);
          } else {
            elem.parentNode.insertBefore(rdgElement, elem.nextSibling);
          }
        } else {
          // The text doesn't have to be substituted, but an anchor must be inserted
          var anchorElement = document.createElement('span');
          anchorElement.setAttribute('data-app-id', entry.id);
          anchorElement.setAttribute('class', 'depaAnchor');
          anchorElement.setAttribute('id', 'depaAnchor-' + entry.id + '-' + wit);
          if (elem.childNodes && elem.childNodes.length > 0) {
            elem.insertBefore(anchorElement, elem.firstChild);
          } else {
            elem.parentNode.insertBefore(anchorElement, elem.nextSibling);
          }
          rdgElement.setAttribute('data-overlap', true);
          if (endId === startId) {
            fromAnchor = fromAnchor.firstChild;
            toAnchor = toAnchor.lastChild;
          }
          var elems = Utils.DOMutils.getElementsBetweenTree(fromAnchor, toAnchor);
          elems.forEach(el => {
            var newNode;
            if (el.nodeType === 3) {
              newNode = document.createElement('span');
              newNode.setAttribute('class', 'depaContent');
              newNode.textContent = el.textContent;
            } else if (!el.className || el.className.indexOf('depaContent') < 0) {
              var newNode = evtParser.parseXMLElement(dom, el, { skip: skipFromBeingParsed });
              newNode.className += ' depaContent';
            }
            if (newNode) {
              el.parentNode.replaceChild(newNode, el);
            }
          });
          if (toAnchor.childNodes && toAnchor.childNodes.length > 0) {
            toAnchor.appendChild(rdgElement);
          } else {
            toAnchor.parentNode.insertBefore(rdgElement, toAnchor);
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