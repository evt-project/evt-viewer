angular.module('evtviewer.dataHandler')

.service('evtDepaParser', function(parsedData, evtCriticalElementsParser, evtParser) {
  var parser = {};

  var startElements = {};

  parser.setDepaElementInText = function(elem, textType, doc) {
    var depaEndIds = parsedData.getCriticalEntries()._indexes.depa.end,
        depaStartIds = parsedData.getCriticalEntries()._indexes.depa.start,
        spanElement;
    if (elem.hasAttribute('xml:id')) {
      var elemId = elem.getAttribute('xml:id');
      var endIdIndex = Object.values(depaEndIds).indexOf(elemId);
      var startIdIndex = Object.values(depaStartIds).indexOf(elemId);
      if (elemId && endIdIndex >= 0) {
        var entry = parsedData.getCriticalEntryById(Object.keys(depaEndIds)[endIdIndex]);
        spanElement = evtCriticalElementsParser.getDepaEntry(entry, '');
        parser.setDepaElementBaseText(elem, entry, doc);
      }
      if (startIdIndex >= 0) {
        var entry = parsedData.getCriticalEntryById(Object.keys(depaStartIds)[startIdIndex]);        
        startElements[entry.id] = elem;
      }
    }
    return spanElement;
  };

  parser.setDepaElementBaseText = function(elem, entry, doc) {
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
        entry.header = entry.header.substring(0, entry.header.lastIndexOf('<'));
        entry.header = evtParser.balanceXHTML(entry.header);
      }
      entry.header = entry.header.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '').trim();;
    }
  }

  return parser;
});