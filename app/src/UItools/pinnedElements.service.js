angular.module('evtviewer.UItools')

.service('evtPinnedElements', function(Utils, parsedData) {
    var pinnedElements = {};
    
    var pinned = {
    	_indexes: [],
    	_indexesByType: {
    		_types: []
    	}
    };

    pinnedElements.getElementsFromCookies = function() {
    	var cookies = document.cookie.split(';');
        for (var key in cookies) {
            var cookie = cookies[key].split('=');
            if (cookie[0].trim() === 'pinned') {
                var pinnedCookie = JSON.parse(cookie[1]);

                // Check if pinned elements exists
                for (var i = 0; i < pinnedCookie._indexes.length; i++) {
                	var elementId = pinnedCookie._indexes[i],
                		pinnedElement = pinnedCookie[elementId],
                		exists = false;
                	if (pinnedElement) {
	                	// 'Critical Apparatus Entries' type='criticalApparatusEntry'
	                	if (pinnedElement.type === 'criticalApparatusEntry') {
		                	exists = (parsedData.getCriticalEntryById(elementId) !== undefined); 
	                	} 
	                	// 'Named Entities' type='namedEntity'
	                	else if (pinnedElement.type.indexOf('namedEntity') >= 0){
	                		exists = (parsedData.getNamedEntity(elementId) !== undefined);
	                	}
	                	if (exists) {
	                		pinnedElements.addElement(pinnedCookie[elementId]);
	                	}
                	}
                }
            }
        }
    };


    pinnedElements.addElement = function(element) {
    	pinned[element.id] = element;
    	pinned._indexes.push(element.id);

    	if (pinned._indexesByType[element.type] === undefined) {
    		pinned._indexesByType[element.type] = [];
    		pinned._indexesByType._types.push(element.type);
    	}
    	pinned._indexesByType[element.type].push(element.id);
    	document.cookie = 'pinned' + '=' + JSON.stringify(pinned) + '; 1';
    };

    pinnedElements.removeElement = function(element) {
    	var index = pinned._indexes.indexOf(element.id);
    		pinned._indexes.splice(index, 1);
    	if (pinned._indexesByType[element.type]) {
    		var indexInTypes = pinned._indexesByType[element.type].indexOf(element.id);
    		pinned._indexesByType[element.type].splice(indexInTypes, 1);

    		if (pinned._indexesByType[element.type].length === 0) {
    			delete pinned._indexesByType[element.type];
    			var typeIndex = pinned._indexesByType._types.indexOf(element.type);
    			pinned._indexesByType._types.splice(typeIndex, 1);
    		}
    	}
    	delete pinned[element.id];
    	document.cookie = 'pinned' + '=' + JSON.stringify(pinned) + '; 1';
    };

    pinnedElements.getPinnedData = function() {
    	return pinned;
    };

    pinnedElements.getPinned = function() {
    	return pinned._indexes;
    };

    pinnedElements.getAvailablePinnedTypes = function() {
    	return pinned._indexesByType._types;
    };

    pinnedElements.getPinnedByType = function(type) {
    	return pinned._indexesByType[type];
    };

    pinnedElements.getPinnedElement = function(elementId) {
    	return pinned[elementId];
    };

    pinnedElements.getPinnedElementType = function(elementId) {
    	return pinned[elementId].type;
    };

    pinnedElements.isPinned = function(elementId) {
    	return pinned[elementId] !== undefined;
    };

    return pinnedElements;
});