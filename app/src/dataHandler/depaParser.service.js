angular.module('evtviewer.dataHandler')

.service('evtDepaParser', function(parsedData, evtCriticalElementsParser, evtParser, xmlParser, config) {
  var parser = {};
  
	var apparatusEntryDef = '<app>',
  lemmaDef = '<lem>',
  parsedLemmaDef = lemmaDef + ', <rdg>',
  parsedLemmaGroupDef = '<rdgGrp>',
  quoteDef = config.quoteDef,
  analogueDef = config.analogueDef,
  analogueRegExpr = evtParser.createRegExpr(analogueDef);

  parser.setElementInText = function(elem, textType, doc) {
    if (!parsedData.getCriticalEntries()._indexes.depa) {
      return;
    }
    var depaEndIds = parsedData.getCriticalEntries()._indexes.depa.end,
        depaStartIds = parsedData.getCriticalEntries()._indexes.depa.start,
        spanElement;
    if (elem.hasAttribute('xml:id')) {
      var elemId = elem.getAttribute('xml:id');
      var endIdIndex = Object.values(depaEndIds).indexOf(elemId);
      var startIdIndex = Object.values(depaStartIds).indexOf(elemId);
      if (elemId && endIdIndex >= 0) {
        var entry = parsedData.getCriticalEntryById(Object.keys(depaEndIds)[endIdIndex]);
        // parser.setDepaAppLemma(elem, entry, doc);
        spanElement = evtCriticalElementsParser.getDepaEntryText(entry, textType, 'end');
      }
      if (startIdIndex >= 0) {
        var entry = parsedData.getCriticalEntryById(Object.keys(depaStartIds)[startIdIndex]);        
        // parser.setDepaAppLemma(elem, entry, doc);
        spanElement = evtCriticalElementsParser.getDepaEntryText(entry, textType, 'start');        
      }
    }
    return spanElement;
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
        lemma = evtParser.balanceXHTML(lemma);
      }
      lemma = lemma.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '').trim();;
      parser.parseLemma(entry, lemma);
    }
  };

  parser.parseLemma = function(entry, lemma) {
    var parsedLemma = {
      id: entry.id + '-depa-lem',
      attributes: [],
      content: [],
      note: '',
      _significant: true,
      _group: undefined,
      _xmlTagName: '',
      _xmlSource: lemma
    };
    var node = xmlParser.parse('<lem>' + lemma + '</lem>');
    angular.forEach(node.childNodes, (child) => {
      if (child.nodeType === 3) {
				if (child.textContent.trim() !== '') {
					parsedLemma.content.push(child.textContent.trim());
				}
			} else if (child.nodeType === 1) {
        if (apparatusEntryDef.indexOf('<' + child.tagName + '>') >= 0) {
					// Sub apparatus
					var entryApp = evtCriticalElementsParser.handleAppEntry(child, entry.id);
					// Check if the app is inside a recensioApp or not (@author: CM)
					if (entry.type === 'recensioApp' && elem.parentNode.tagName === 'rdgGrp') {
						var entryAppInRecensio = evtCriticalElementsParser.handleAppEntry(child, elem);
						parsedLemma.content.push(entryAppInRecensio);
					} else {
						parsedLemma.content.push({
							id: entryApp.id,
							type: 'subApp'
						});
						entry._indexes.subApps.push(entryApp.id);
					}
				} else {
					var subst = '',
						childXml = '';
					if (angular.element(child)['0'].innerHTML !== undefined) {
						subst = angular.element(child)['0'].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
						childXml = angular.element(child)['0'].outerHTML.replace(subst, '');
					}

					if (parsedLemma._significant) {
						if (config.notSignificantVariant.indexOf('<' + child.tagName + '>') >= 0) {
							parsedLemma._significant = false;
						}
					}
					if (config.fragmentMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
						var fragmentSigla = elem.getAttribute('wit');
						child.setAttribute('wit', fragmentSigla);
					}

					if (config.lacunaMilestone.indexOf(child.tagName) >= 0 && child.getAttribute('wit') === null) {
						var lacunaSigla = elem.getAttribute('wit');
						child.setAttribute('wit', lacunaSigla);
					}

					if (quoteDef.indexOf('<' + child.tagName + '>') >= 0) {
						parsedLemma.content.push(evtCriticalElementsParser.parseQuote(child));
					} else if (analogueRegExpr.test(childXml)) {
						parsedLemma.content.push(evtCriticalElementsParser.parseAnalogue(child));
					} else if (angular.element(child).find(apparatusEntryDef.replace(/[<>]/g, ''))) {
						parsedLemma.content.push(evtCriticalElementsParser.parseGenericElement(child));
					} else {
						parsedLemma.content.push(child.cloneNode(true));
					}
				}
      }
    });
    entry.content[parsedLemma.id] = parsedLemma;
    entry.lemma = parsedLemma.id;
  }

  return parser;
});