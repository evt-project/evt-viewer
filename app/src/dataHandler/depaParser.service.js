angular.module('evtviewer.dataHandler')

.service('evtDepaParser', function(parsedData, evtCriticalElementsParser, evtParser) {
  var parser = {};

  parser.setDepaElementInText = function(elem, textType, doc) {
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
        parser.setDepaAppLemma(elem, entry, doc);
        spanElement = evtCriticalElementsParser.getDepaEntryText(entry, textType, 'end');
      }
      if (startIdIndex >= 0) {
        var entry = parsedData.getCriticalEntryById(Object.keys(depaStartIds)[startIdIndex]);        
        parser.setDepaAppLemma(elem, entry, doc);
        spanElement = evtCriticalElementsParser.getDepaEntryText(entry, textType, 'start');        
      }
    }
    return spanElement;
  };

  parser.setDepaAppLemma = function(elem, entry, doc) {
    if (entry.header) {
      return;
    }
    var depaStartIds = parsedData.getCriticalEntries()._indexes.depa.start,
        depaEndIds = parsedData.getCriticalEntries()._indexes.depa.end,
        startId = depaStartIds[entry.id],
        endId = depaEndIds[entry.id],
        location = parsedData.getEncodingDetail('variantEncodingLocation');
    if (startId) {
      entry.header = '';
      if (startId === endId) {
        entry.header = elem.outerHTML;
      } else {
        var docString = doc.outerHTML;
        var startPos = docString.search('xml:id="' + startId),
            endPos = 0;
        if (location === 'internal') {
          var string = elem.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
          endPos = docString.search(string);
        } else {
          endPos = docString.search('xml:id="' + endId + '"');
        }
        entry.header = docString.substring(startPos, endPos);
        entry.header = entry.header.substring(entry.header.indexOf('>') + 1);
        if (location === 'external') {
          entry.header = entry.header.substring(0, entry.header.lastIndexOf('<'));
        }
        entry.header = evtParser.balanceXHTML(entry.header);
      }
      entry.header = entry.header.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '').trim();;
    }
  };

  return parser;
});