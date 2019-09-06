angular.module('evtviewer.dataHandler')

.service('evtDepaParser', function(parsedData, evtCriticalElementsParser, Utils, evtParser, config, xmlParser) {
  var parser = {};

  var apparatusEntryDef = '<app>',
		lemmaDef = '<lem>',
		readingDef = lemmaDef + ', <rdg>',
		readingGroupDef = '<rdgGrp>',
		quoteDef = config.quoteDef,
		analogueDef = config.analogueDef,
	  skipFromBeingParsed = '<evt-reading>,<pb>,' + apparatusEntryDef + ',' + readingDef + ',' + readingGroupDef + ',' + quoteDef + ',' + analogueDef + ',<evt-quote>,<evt-analogue>,<evt-version-reading>';

  parser.setAppInText = function(fromAnchor, wit, dom) {
    if (!parsedData.getCriticalEntries()._indexes.depa) {
      return;
    }
    var depaStartIds = parsedData.getCriticalEntries()._indexes.depa.start,
        elemId = fromAnchor.getAttribute('xml:id'),
        startEntryIds = Object.keys(depaStartIds).filter(function(key) { return depaStartIds[key] === elemId }) || [];
    angular.forEach(startEntryIds, function(entryId) {
      var entry = parsedData.getCriticalEntryById(entryId);
      if (!entry) { return; }
      var endId = parsedData.getCriticalEntries()._indexes.depa.end[entryId],
          toAnchor = dom.querySelector('[*|id="' + endId + '"]');
      if (!toAnchor) { return; }
      var rdgElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit)
        : evtCriticalElementsParser.getEntryLemmaText(entry, wit);
      var method = parsedData.getEncodingDetail('variantEncodingMethod');
      rdgElement.setAttribute('data-method', method || 'double-end-point');

      // If the text needs to be replaced by the entry
      if (!rdgElement.firstChild || (!rdgElement.firstChild.className || rdgElement.firstChild.className.indexOf('empty') < 0)) {
        if (fromAnchor === toAnchor) {
          parser.removeChildNodes(fromAnchor);
        } else {
          if ((fromAnchor.childNodes && fromAnchor.childNodes.length > 0) || parser.isDescendant(fromAnchor, toAnchor)) {
            var from = document.createTextNode('');
            fromAnchor.parentNode.insertBefore(from, fromAnchor);
            fromAnchor = from;
          }
          var elems = Utils.DOMutils.getElementsBetweenTree(fromAnchor, toAnchor);
          angular.forEach(elems, function(el) {
            el.parentNode.removeChild(el);
          });
        }
        fromAnchor.parentNode.insertBefore(rdgElement, fromAnchor);
      } else {
        // The text doesn't have to be substituted, but an anchor must be inserted
        var anchor = parser.createAnchorElement(entry, wit);
        fromAnchor.parentNode.insertBefore(anchor, fromAnchor);
        rdgElement.setAttribute('data-no-text', true);
        toAnchor.parentNode.insertBefore(rdgElement, toAnchor.nextSibling);
      }
    });
  };

  parser.setInternalAppInText = function(app, entry, wit, doc) {
    var rdgElement = wit ? evtCriticalElementsParser.getEntryWitnessReadingText(entry, wit)
    : evtCriticalElementsParser.getEntryLemmaText(entry, wit);
    
    var startId = entry.attributes['from'].replace('#', ''),
        endId = entry.attributes['to'] ? entry.attributes['to'].replace('#', '') : null,
        fromAnchor = startId ? doc.querySelector('[*|id="' + startId + '"]') || null : null,
        toAnchor = endId ? doc.querySelector('[*|id="' + endId + '"]') || null : app;
    if (!fromAnchor || !toAnchor) { return; }

    if ((fromAnchor.childNodes && fromAnchor.childNodes.length > 0) || parser.isDescendant(fromAnchor, toAnchor)) {
      var from = document.createTextNode('');
      fromAnchor.parentNode.insertBefore(from, fromAnchor);
      fromAnchor = from;
    }
    var elems = Utils.DOMutils.getElementsBetweenTree(fromAnchor, toAnchor);

    if (!rdgElement.firstChild || (!rdgElement.firstChild.className || rdgElement.firstChild.className.indexOf('empty') < 0)) {
      angular.forEach(elems, function(el) {
        var text = document.createTextNode('');
        el.parentNode.replaceChild(text, el);
      });
      fromAnchor.parentNode.insertBefore(rdgElement, fromAnchor.nextSibling);     
    } else {
      rdgElement.setAttribute('data-overlap', true);
      var anchorElement = parser.createAnchorElement(entry, wit);
      fromAnchor.parentNode.insertBefore(anchorElement, fromAnchor.nextSibling);
      angular.forEach(elems, function(el) {
        var newNode = parser.createDepaContentNode(el, doc);
        if (newNode) {
          el.parentNode.replaceChild(newNode, el);
        }
      });
      rdgElement.setAttribute('data-no-text', true);
      toAnchor.parentNode.insertBefore(rdgElement, toAnchor.nextSibling);
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
          lemma = elem.outerHTML;
        }
      } else {
        var docString = doc.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
        lemma = parser.findReadingString(docString, endId, startId, entry);
        lemma = evtParser.balanceXHTML(lemma);
      }
      lemma = lemma.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '').trim();
      parser.parseLemma(entry, lemma, doc);
    }
  };

  parser.findReadingString = function(docString, endId, startId, entry) {
    var fromId = docString.indexOf('xml:id="' + startId),
        startPos = docString.substring(0, fromId).lastIndexOf('<'),
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

  parser.parseLemma = function(entry, lemma, doc) {
    var lemmaElem; content = lemma;
    if (typeof lemma !== 'string') {
      lemmaElem = xmlParser.parse(lemma);
      content = evtParser.parseXMLElement(doc, lemmaElem, { skip: skipFromBeingParsed });
      content = content.textContent ? content.textContent : lemmaElem.textContent;
    }
    var parsedLemma = {
      id: entry.id + '-depa-lem',
      attributes: [],
      content: [content],
      note: '',
      _significant: true,
      _group: undefined,
      _xmlTagName: '',
      _xmlSource: lemma
    };
    entry.content[parsedLemma.id] = parsedLemma;
    entry.lemma = parsedLemma.id;
  }

  parser.removeChildNodes = function(element) {
    if (!element.childNodes || element.childNodes.length <= 0) {
      return;
    }
    var index = element.childNodes.length - 1;
    while (index >= 0) {
      element.removeChild(element.childNodes[index]);
      index--;
    }
  }
  
  parser.isDescendant = function(parent, child) {
    if (!child) {
      return;
    }
    var node = child.parentNode;
    while (node) {
      if (node === parent) {
        return true;
      } else {
        return parser.isDescendant(parent, node.parentNode);
      }
    }
    return false;
  }

  parser.createAnchorElement = function(entry, wit) {
    var anchorElement = document.createElement('span');
    anchorElement.setAttribute('data-app-id', entry.id);
    anchorElement.setAttribute('class', 'depaAnchor');
    anchorElement.setAttribute('id', 'depaAnchor-' + entry.id + '-' + wit);
    return anchorElement;
  }

  parser.createDepaContentNode = function(element, doc) {
    var depaNode;
    if (element.nodeType === 3) {
      depaNode = document.createElement('span');
      depaNode.setAttribute('class', 'depaContent');
      depaNode.textContent = element.textContent;
    } else if (!element.className || element.className.indexOf('depaContent') < 0) {
      depaNode = evtParser.parseXMLElement(doc, element, { skip: skipFromBeingParsed });
      depaNode.className += ' depaContent';
    }
    return depaNode;
  }

  return parser;
});