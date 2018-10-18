angular.module('evtviewer.dataHandler')

.service('evtDepaParser', function(parsedData, evtCriticalElementsParser) {
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
        endId = depaEndIds[entry.id];
    if (startId) {
      entry.header = '';
      if (startId === endId) {
        entry.header = elem.innerHTML;
      } else if (elem.parentNode.getAttribute('xml:id') === startId) {
        var index = 0,
            currentSibling = elem.parentNode.childNodes[0]; 
        while (index < elem.parentNode.childNodes.length && (currentSibling.nodeType === 3 || currentSibling.getAttribute('xml:id') !== endId)) {
          entry.header += elem.parentNode.childNodes[index].innerHTML ? elem.parentNode.childNodes[index].innerHTML : elem.parentNode.childNodes[index].textContent;
          index++;
          currentSibling = elem.parentNode.childNodes[index];
        }
      } else if (startElements[entry.id]) {
        var startElem = startElements[entry.id];
        if (startElem.childNodes && startElem.childNodes.length > 0) {
          entry.header += startElem.innerHTML;
        }
        var index = 0,
            currentSibling = startElem.parentNode.childNodes[0]; 
        while (index < startElem.parentNode.childNodes.length && (currentSibling.nodeType === 3 || currentSibling.getAttribute('xml:id') !== endId)) {
          entry.header += startElem.parentNode.childNodes[index].innerHTML ? startElem.parentNode.childNodes[index].innerHTML : startElem.parentNode.childNodes[index].textContent;
          index++;
          currentSibling = startElem.parentNode.childNodes[index];
        }
      }
      entry.header.trim();
    }
  }

  return parser;
});