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

  parser.setAppInText = function(elem, wit, dom) {
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
        startEntryIds = Object.keys(depaStartIds).filter(function(key) { return depaStartIds[key] === elemId }) || [];
    angular.forEach(startEntryIds, function(entryId) {
      entry = parsedData.getCriticalEntryById(entryId);
      if (entry) {
        var rdgElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit)
          : evtCriticalElementsParser.getEntryLemmaText(entry, wit);
        var method = parsedData.getEncodingDetail('variantEncodingMethod');
        rdgElement.setAttribute('data-method', method);

        var startId = depaStartIds[entryId], endId = depaEndIds[entryId],
            fromAnchor = dom.querySelector('[*|id="' + startId + '"]'),
            toAnchor = dom.querySelector('[*|id="' + endId + '"]');
        if (toAnchor.parentNode === fromAnchor) {
          var from = document.createTextNode('');
          fromAnchor.parentNode.insertBefore(from, fromAnchor);
          fromAnchor = from;
        }
        // If the text needs to be substitute by the entry
        if (!rdgElement.firstChild || (!rdgElement.firstChild.className || rdgElement.firstChild.className.indexOf('empty') < 0)) {
          if (startId === endId) {
            index = fromAnchor.childNodes.length - 1;
            while (index >= 0) {
              fromAnchor.removeChild(fromAnchor.childNodes[index]);
              index--;
            }
          } else {
            var elems = Utils.DOMutils.getElementsBetweenTree(fromAnchor, toAnchor);
            angular.forEach(elems, function(el) {
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
          if (endId === startId) {
            fromAnchor = fromAnchor.firstChild;
            toAnchor = toAnchor.lastChild;
          }
          if (toAnchor.childNodes && toAnchor.childNodes.length > 0) {
            toAnchor.appendChild(rdgElement);
          } else {
            toAnchor.parentNode.insertBefore(rdgElement, toAnchor);
          }
        }
      }
    });
  };

  parser.setInternalAppInText = function(app, entry, wit, doc) {
    var rdgElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit)
    : evtCriticalElementsParser.getEntryLemmaText(entry, wit);
    
    var startId = entry.attributes['from'].replace('#', ''),
        endId = entry.attributes['to'] ? entry.attributes['to'].replace('#', '') : null,
        fromAnchor, toAnchor;
    
    if (endId) {
      toAnchor = doc.querySelector('[*|id="' + endId + '"]');
    } else {
      toAnchor = app;
    }
    if (startId) {
      fromAnchor = doc.querySelector('[*|id="' + startId + '"]');
      if (toAnchor.parentNode === fromAnchor) {
        var from = document.createTextNode('');
        fromAnchor.parentNode.insertBefore(from, fromAnchor);
        fromAnchor = from;
      }
    }
    var elems = Utils.DOMutils.getElementsBetweenTree(fromAnchor, toAnchor);
    if (!rdgElement.firstChild || (!rdgElement.firstChild.className || rdgElement.firstChild.className.indexOf('empty') < 0)) {
      angular.forEach(elems, function(el) {
        var text = document.createTextNode('');
        el.parentNode.replaceChild(text, el);
      });
      if (fromAnchor.childNodes && fromAnchor.childNodes.length > 0) {
        fromAnchor.insertBefore(rdgElement, fromAnchor.firstChild);
      } else {
        fromAnchor.parentNode.insertBefore(rdgElement, fromAnchor.nextSibling);
      }      
    } else {
      rdgElement.setAttribute('data-overlap', true);
      var anchorElement = document.createElement('span');
          anchorElement.setAttribute('data-app-id', entry.id);
          anchorElement.setAttribute('class', 'depaAnchor');
          anchorElement.setAttribute('id', 'depaAnchor-' + entry.id + '-' + wit);
      if (fromAnchor.childNodes && fromAnchor.childNodes.length > 0) {
        fromAnchor.insertBefore(anchorElement, fromAnchor.firstChild);
      } else {
        fromAnchor.parentNode.insertBefore(anchorElement, fromAnchor.nextSibling);
      }
      angular.forEach(elems, function(el) {
        var newNode;
        if (el.nodeType === 3) {
          newNode = document.createElement('span');
          newNode.setAttribute('class', 'depaContent');
          newNode.textContent = el.textContent;
        } else if (!el.className || el.className.indexOf('depaContent') < 0) {
          var newNode = evtParser.parseXMLElement(doc, el, { skip: skipFromBeingParsed });
          newNode.className += ' depaContent';
        }
        if (newNode) {
          el.parentNode.replaceChild(newNode, el);
        }
      });
      if (toAnchor === app) {
        toAnchor.parentNode.insertBefore(rdgElement, toAnchor);
      } else if (toAnchor.childNodes && toAnchor.childNodes.length > 0) {
        toAnchor.appendChild(rdgElement);
      } else {
        toAnchor.parentNode.insertBefore(rdgElement, toAnchor);
      }
    }
    return rdgElement;
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